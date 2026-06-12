import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js'; 
import { requestContext } from '../database/context/RequestContext'; 
import IDocumentBDClient from '../interfaces/IDocumentBDClient';
import { DocumentGrpcService } from '../interfaces/DocumentoGrpcService';
import { DocumentoDTO, CrearDocumentoDTO } from '../DTO/DocumentoDTO';

@Injectable()
export class BDDocumentClient implements IDocumentBDClient, OnModuleInit {
    private documentGrpcService!: DocumentGrpcService;

    constructor(@Inject('DOCUMENT_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.documentGrpcService = this.client.getService<DocumentGrpcService>('DocumentoService');
    }

    private getGrpcMetadata(): Metadata {
        const store = requestContext.getStore();
        const token = store?.get('token');
        const metadata = new Metadata();
        if (token) {
            metadata.add('authorization', `Bearer ${token}`);
        }
        return metadata;
    }

    async obtenerMetadataDocumentoPorId(id: string): Promise<any> {
        const metadata = this.getGrpcMetadata();
        return firstValueFrom(
            this.documentGrpcService.GetById({ id }, metadata)
        );
    }

    async crearMetadataDocumento(idPadre: string, doc: CrearDocumentoDTO): Promise<any> {
        const metadata = this.getGrpcMetadata();
        const request = {
            idCarpeta: String(idPadre),
            doc: {
                id: "",
                nombre: doc.nombre || "Sin título",
                idUsuario: String(doc.idUsuario),
                estado: doc.estado || "PENDING_UPLOAD",
                version: "1.0",
                fechaCreacion: new Date().toISOString(), 
                fechaUltimaModificacion: new Date().toISOString()
            }
        };
        return firstValueFrom(this.documentGrpcService.Registrar(request, metadata));
    }

    async actualizarMetadataDocumento(id: string, doc: DocumentoDTO): Promise<any> {
        const metadata = this.getGrpcMetadata();
        
        const request = {
            id: String(id),
            doc: {
                id: String(id),
                nombre: doc.nombre,
                idUsuario: doc.idUsuario,
                estado: doc.estado || "COMMITTED",
                version: "1.0",
                fechaCreacion: doc.fechaCreacion ? new Date(doc.fechaCreacion).toISOString() : new Date().toISOString(),
                fechaUltimaModificacion: new Date().toISOString()
            }
        };
        return firstValueFrom(this.documentGrpcService.Actualizar(request, metadata));
    }

    async eliminarMetadataDocumento(id: string, idUsuario: string): Promise<any> {
        const metadata = this.getGrpcMetadata();
        const request = { 
            id: String(id) 
        };
        return firstValueFrom(this.documentGrpcService.Eliminar(request, metadata));
    }
}