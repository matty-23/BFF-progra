import { Injectable, Inject, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';
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
    obtenerMetadataDocumentoPorId(id: string): Promise<any> {
        return firstValueFrom(this.documentGrpcService.GetById({ id }));
    }
    crearMetadataDocumento(idPadre: string, doc: CrearDocumentoDTO): Promise<any> {
        const request = {
            idCarpeta: String(idPadre),
            doc: {
                id: "",
                nombre: doc.nombre || "Sin título",
                idUsuario: String(doc.idUsuario),
                estado: doc.estado || "PENDING_UPLOAD",
                version: "1.0",
                fechaCreacion: new Date(), 
                fechaUltimaModificacion: new Date()
            }
        };
        return firstValueFrom(this.documentGrpcService.Registrar(request));
    }
    actualizarMetadataDocumento(id: string, doc: DocumentoDTO): Promise<any> {
        const request = {
            id: String(id),
            doc
        };
        return firstValueFrom(this.documentGrpcService.Actualizar(request));
    }
eliminarMetadataDocumento(id: string, idUsuario: string): Promise<any> {

        const request = { 
            id: String(id) 
        };
        
        return firstValueFrom(this.documentGrpcService.Eliminar(request));
    }

}