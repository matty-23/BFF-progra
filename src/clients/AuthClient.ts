import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthClient {
    async loginCore(credenciales: any): Promise<{ access_token: string, usuario: any }> {
        try {
            const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales)
            });

            if (!response.ok) {
                throw new UnauthorizedException('Credenciales inválidas en el Core');
            }

            const data = await response.json();
            return {
                access_token: data.token,
                usuario: data.usuario
            };
        } catch (error) {
            throw new UnauthorizedException('Error al comunicarse con el servicio de autenticación');
        }
    }

    async registerCore(credenciales: any): Promise<any> {
        try {
            const response = await fetch(`${process.env.BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales)
            });

            if (!response.ok) {
                throw new BadRequestException('Error al registrar usuario en el Core');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async logoutCore(token?: string): Promise<any> {
        try {
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${process.env.BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: headers
            });
            
            if (!response.ok) {
                throw new BadRequestException('Error al cerrar sesión en el Core');
            }
            if (response.status !== 204) {
                return await response.json();
            }
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
}