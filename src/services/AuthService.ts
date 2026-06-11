// src/services/AuthService.ts
import { Injectable } from '@nestjs/common';
import { AuthClient } from '../clients/AuthClient';
import { IAuthService } from '../interfaces/IAuthService';

@Injectable()
export class AuthService implements IAuthService {
    constructor(private readonly authClient: AuthClient) { }

    async Login(credenciales: any) {
        try {
            const authData = await this.authClient.loginCore(credenciales);
            return authData;
        } catch (error) {
            throw error;
        }
    }

    async LoginOut(credenciales: any): Promise<any> {
        try {
            const result = await this.authClient.logoutCore(credenciales?.token);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async Register(credenciales: any): Promise<any> {
        try {
            const result = await this.authClient.registerCore(credenciales);
            return result;
        } catch (error) {
            throw error;
        }
    }
}