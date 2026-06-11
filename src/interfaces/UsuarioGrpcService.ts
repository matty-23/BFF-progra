import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import UserDto from '../DTO/UserDto';

export interface UsuarioGrpcService {
    GetById(data: { id: string }, metadata: Metadata): Observable<UserDto>;

    GetByUsername(data: { username: string },metadata: Metadata): Observable<UserDto>;

    Actualizar(data: { id: string; usuario: any },metadata: Metadata): Observable<UserDto>;

    Eliminar(data: { id: string },metadata: Metadata): Observable<void>;
}