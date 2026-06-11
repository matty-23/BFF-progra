import { Observable } from 'rxjs';
import { ComponenteDto } from '../DTO/ComponenteDto';
import { Metadata } from '@grpc/grpc-js'; 

export interface CarpetaGrpcService {
    GetById(data: { id: string }, metadata?: Metadata): Observable<ComponenteDto>;
    GetComponentes(data: { id: string }, metadata?: Metadata): Observable<{ componentes: ComponenteDto[] }>;
    CarpetasPrincipales(data: { id: string }, metadata?: Metadata): Observable<{ carpetasPrincipales: any[] }>;
    Registrar(data: { idPadre: string, carp: Partial<ComponenteDto> }, metadata?: Metadata): Observable<ComponenteDto>;
    Actualizar(data: { id: string, carp: Partial<ComponenteDto> }, metadata?: Metadata): Observable<{ success: boolean }>;
    Eliminar(data: { id: string }, metadata?: Metadata): Observable<{ success: boolean }>;
}