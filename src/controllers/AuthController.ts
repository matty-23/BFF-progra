import { Controller, Post, Body, Headers, Inject } from '@nestjs/common';
import { IAuthService } from '../interfaces/IAuthService';

@Controller('api/auth')
export class AuthController {
    constructor(@Inject('IAuthService') private readonly authService: IAuthService) {}
    
    @Post('login')
    async login(@Body() credenciales: any) {
        return await this.authService.Login(credenciales);
    }

    @Post('logout')
    async logout(@Headers('authorization') authHeader: string) {
        const token = authHeader ? authHeader.split(' ')[1] : undefined;
        
        await this.authService.LoginOut({ token });
        return { message: 'Logout exitoso' };
    }

    @Post('register')
    async register(@Body() credenciales: any) {
        const resultado = await this.authService.Register(credenciales);
        return { 
            message: 'Registro exitoso', 
            data: resultado 
        };
    }
}