import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { requestContext } from '../database/context/RequestContext';
import IUserClient from '../interfaces/IUserClient';
import User from '../viewModels/User';
import UserDto from '../DTO/UserDto';
import { UsuarioGrpcService } from '../interfaces/UsuarioGrpcService';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export default class UserProfile implements IUserClient, OnModuleInit {
    private usuarioGrpcService!: UsuarioGrpcService;

    constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

    onModuleInit() {this.usuarioGrpcService = this.client.getService<UsuarioGrpcService>('UsuarioService');}

    private getGrpcMetadata(): Metadata {
        const store = requestContext.getStore();
        const token = store?.get('token');
        const metadata = new Metadata();
        if (token) {
            metadata.add('authorization', `Bearer ${token}`);
        }
        return metadata;
    }

    async getById(id: string): Promise<User> {
        try {
            const metadata = this.getGrpcMetadata();
            const response = await firstValueFrom(this.usuarioGrpcService.GetById({ id }, metadata));

            return new User(
                response.id,
                response.nombre,
                response.apellido,
                response.email,
                response.username,
                "", 
                new Date(response.fechaCreacion)
            );

        } catch (error: any) {
            console.error(`[UserProfile Client] Fallo al obtener el usuario ${id}:`, error.details || error.message);
            throw new Error(`Error en el servidor Core: ${error.details || error.message}`);
        }
    }


    async updateById(id: string, user: UserDto): Promise<boolean> {
        try {
            const metadata = this.getGrpcMetadata();
            const request = {
                id: id,
                usuario: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    username: user.username
                }
            };

            await firstValueFrom(this.usuarioGrpcService.Actualizar(request, metadata));
            return true;
        } catch (error: any) {
            console.error(`[UserProfile Client] Fallo al actualizar el usuario:`, error.details || error.message);
            throw new Error(`Error al actualizar: ${error.details || error.message}`);
        }
    }

    async deleteById(id: string): Promise<void> {
        try {
            const metadata = this.getGrpcMetadata();
            await firstValueFrom(this.usuarioGrpcService.Eliminar({ id }, metadata));
        } catch (error: any) {
            console.error(`[UserProfile Client] Fallo al eliminar el usuario:`, error.details || error.message);
            throw new Error(`Error al eliminar: ${error.details || error.message}`);
        }
    }
}