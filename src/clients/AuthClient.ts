import { Injectable, Inject, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClient implements OnModuleInit {
    private authGrpcService: any;

    constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {this.authGrpcService = this.client.getService<any>('AuthService');}

    private handleError(error: any): never {
        const status = error?.code === 16 ? HttpStatus.UNAUTHORIZED : 
                       error?.code === 3 ? HttpStatus.BAD_REQUEST : 
                       HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(error?.details || error?.message || 'Error interno en el Core', status);
    }

    async loginCore(credenciales: any): Promise<any> {
        try {
            return await firstValueFrom(this.authGrpcService.Login(credenciales));
        } catch (error) {
            this.handleError(error);
        }
    }

    async registerCore(credenciales: any): Promise<any> {
        try {
            return await firstValueFrom(this.authGrpcService.Register(credenciales));
        } catch (error) {
            this.handleError(error);
        }
    }

    async refreshCore(refreshToken: string): Promise<any> {
        try {
            return await firstValueFrom(this.authGrpcService.Refresh({ refreshToken }));
        } catch (error) {
            this.handleError(error);
        }
    }

    async logoutCore(token?: string): Promise<any> {
        try {
            return await firstValueFrom(this.authGrpcService.Logout({ token: token || '' }));
        } catch (error) {
            this.handleError(error);
        }
    }
}