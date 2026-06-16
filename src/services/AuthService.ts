import { Injectable } from '@nestjs/common';
import { AuthClient } from '../clients/AuthClient';
import { IAuthService } from '../interfaces/IAuthService';

@Injectable()
export class AuthService implements IAuthService {
    constructor(private readonly authClient: AuthClient) { }

    async Login(credenciales: any) {
        return await this.authClient.loginCore(credenciales);
    }

    async LoginOut(credenciales: any): Promise<any> {
        return await this.authClient.logoutCore(credenciales?.token);
    }

    async Register(credenciales: any): Promise<any> {
        return await this.authClient.registerCore(credenciales);
    }

    async Refresh(refreshToken: string): Promise<any> {
        return await this.authClient.refreshCore(refreshToken);
    }
}