import { Observable } from 'rxjs';
import { DocumentoDTO } from '../DTO/DocumentoDTO';
import { Metadata } from '@grpc/grpc-js'; 

export interface DocumentGrpcService {
    GetById(data: { id: string }, metadata?: Metadata): Observable<DocumentoDTO>;
    Registrar(data: { idCarpeta: string, doc: Partial<DocumentoDTO> }, metadata?: Metadata): Observable<DocumentoDTO>;
    Actualizar(data: { id: string, doc: Partial<DocumentoDTO> }, metadata?: Metadata): Observable<{ success: boolean }>;
    Eliminar(data: { id: string }, metadata?: Metadata): Observable<{ success: boolean }>;
}