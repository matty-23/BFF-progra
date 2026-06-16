import { Observable } from 'rxjs';
import { ComponenteDto } from '../DTO/ComponenteDto';
import { DocumentoDTO } from '../DTO/DocumentoDTO';
export interface DocumentGrpcService {
    GetById(data: { id: string }): Observable<DocumentoDTO>;
    Registrar(data: { idCarpeta: string, doc: Partial<DocumentoDTO> }): Observable<DocumentoDTO>;
    Actualizar(data: { id: string, doc: Partial<DocumentoDTO> }): Observable<{ success: boolean }>;
    Eliminar(data: { id: string }): Observable<{ success: boolean }>;
}