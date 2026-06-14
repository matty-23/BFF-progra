import { from, firstValueFrom } from 'rxjs';
import { IDocumentosService } from '../interfaces/IDocumentService';
import { BDDocumentClient } from '../clients/BDDocumentClient';
import { FSDocumentClient } from '../clients/FSDocumentClient';
import { CrearDocumentoDTO, DocumentoDTO } from '../DTO/DocumentoDTO';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class DocumentoService implements IDocumentosService {
    private readonly logger = new Logger(DocumentoService.name);
    constructor(
        private readonly BDClient: BDDocumentClient,
        private readonly FSClient: FSDocumentClient
    ) { }

   async crearDocumento(idCarpeta: string, nombre: string, idUsuario: string): Promise<any> {
        this.logger.log(`Iniciando creación de documento: ${nombre}`);
        const documento: CrearDocumentoDTO = { idUsuario, nombre, estado: 'PENDING_UPLOAD' };
        
        let metadataCreada;
        try {
            // 1. Reserva de Metadata
            metadataCreada = await this.BDClient.crearMetadataDocumento(idCarpeta, documento);
        } catch (e) {
            const error = e as Error;
            this.logger.error(`❌ Fallo en BD al registrar metadatos iniciales:`, error.stack || error.message);
            throw new InternalServerErrorException('Error de comunicación con el microservicio de metadatos');
        }

        const docId = metadataCreada.id;

        try {
            const documentoInicial = {
                id: docId,
                title: nombre,
                createdAt: Date.now(),
                blocks: [
                    {
                        id: "block-root-initial", // Un ID base
                        type: 'paragraph',
                        content: '',
                        metadata: {}
                    }
                ]
            };

            // 3. Subir el archivo inicial al Storage
            const stream$ = from([{
                content: Buffer.from(JSON.stringify(documentoInicial)),
                filename: docId
            }]);

            await firstValueFrom(this.FSClient.upload(stream$));
            this.logger.log(`✅ Binario inicial creado en Storage para: ${docId}`);

            // 4. Commit - Confirmamos en Metadatos
            await this.BDClient.actualizarMetadataDocumento(docId, {
                id: docId,
                nombre,
                idUsuario,
                estado: 'COMMITTED' // La Saga finaliza con éxito
            });

            return metadataCreada;

        } catch (e) {
            const error = e as Error;
            this.logger.error(`❌ Saga compensando, fallo en storage al crear ${docId}:`, error.stack || error.message);

            // 5. Compensación - Revertimos el metadato si el Storage falló
            await this.BDClient.actualizarMetadataDocumento(docId, {
                id: docId,
                nombre,
                idUsuario,
                estado: 'FAILED'
            });
            throw new InternalServerErrorException('Error al crear el documento físico, operación revertida');
        }
    }

    async actualizarDocumento(id: string, nombre: string, idUsuario: string, contenido: string): Promise<any> {
        this.logger.log(`Iniciando guardado persistente para documento: ${id}`);
        const stream$ = from([{
            content: Buffer.from(contenido),
            filename: id
        }]);

        try {
            await firstValueFrom(this.FSClient.upload(stream$));
            this.logger.log(`✅ Binario guardado en Storage para: ${id}`);
        } catch (error: any) {
            this.logger.error(`❌ Error en Storage al actualizar documento ${id}`, error.stack || error);
            throw new Error('Error subiendo contenido al storage');
        }
        try {
            // 3. Actualizar metadatos en la BD
            // Enviamos explícitamente estado: 'COMMITTED' por si el microservicio lo exige
            const metadata = await this.BDClient.actualizarMetadataDocumento(id, {
                id,
                nombre,
                idUsuario,
                estado: 'COMMITTED'
            });

            this.logger.log(`✅ Metadatos guardados en BD para: ${id}`);
            return metadata;

        } catch (error: any) {
            this.logger.error(`❌ Error en BD al actualizar metadatos del documento ${id}`, error.stack || error);
            throw new InternalServerErrorException(`Error actualizando metadatos: ${error.message || 'Desconocido'}`);
        }
    }


async obtenerDocumentoPorId(id: string): Promise<any> {

    const metadata = await this.BDClient.obtenerMetadataDocumentoPorId(id);
    if (!metadata) {
        throw new Error('Documento no encontrado');
    }
    const contenido = await this.FSClient.get(metadata.storageId);
    return {
        ...metadata,
        contenido
    };
}

  async eliminarDocumento(id: string): Promise<any> {
        this.logger.log(`Iniciando eliminación del documento: ${id}`);
        
        try {
            await firstValueFrom(this.FSClient.deleteFile(id));
            this.logger.log(`✅ Archivo físico eliminado del Storage: ${id}`);
        } catch (e) {
            const error = e as Error;
            this.logger.warn(`⚠️ Error o archivo inexistente en Storage al borrar ${id}:`, error.message);
        }

        try {

            const result = await this.BDClient.eliminarMetadataDocumento(id);
            this.logger.log(`✅ Metadatos eliminados en BD para: ${id}`);
            return result;
        } catch (e) {
            const error = e as Error;
            this.logger.error(`❌ Error al eliminar metadatos en BD para el documento ${id}:`, error.stack || error.message);
            throw new InternalServerErrorException('Error al eliminar el documento del sistema');
        }
    }
}