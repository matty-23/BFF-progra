import { Observable } from 'rxjs';
import { ComponenteDto } from '../DTO/ComponenteDto';
export interface CarpetaGrpcService {
    GetById(data: { id: string }): Observable<ComponenteDto>;
    GetComponentes(data: { id: string }): Observable<{ componentes: ComponenteDto[] }>;
    CarpetasPrincipales(data: { id: string }): Observable<{ listaUno: ComponenteDto[] }>;
    Registrar(data: { idPadre: string, carp: Partial<ComponenteDto> }): Observable<ComponenteDto>;
    Actualizar(data: { id: string, doc: Partial<ComponenteDto> }): Observable<{ success: boolean }>;
    Eliminar(data: { id: string }): Observable<{ success: boolean }>;
}