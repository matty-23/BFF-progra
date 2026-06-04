import { Injectable, Inject, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class AuthClient implements OnModuleInit {
    private authGrpcService: any;

    constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.authGrpcService = this.client.getService<any>('AuthService');
    }

    async loginCore(credenciales: any): Promise<any> {
        try {
            const response = await firstValueFrom(this.authGrpcService.Login(credenciales));
            return response; 
        } catch (error) {
            throw new UnauthorizedException('Credenciales inválidas en el Core');
        }
    }

    async registerCore(credenciales: any): Promise<any> {
        return await firstValueFrom(this.authGrpcService.Register(credenciales));
    }

    async logoutCore(token?: string): Promise<any> {
        return await firstValueFrom(this.authGrpcService.Logout({ token: token || '' }));
    }
}