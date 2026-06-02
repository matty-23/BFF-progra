import { Controller, Post, Body } from '@nestjs/common';
import { IAuthService } from '../interfaces/IAuthService';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: IAuthService) {}
    
    @Post('login')
    async login(@Body() credenciales: any) {
        // El controlador solo delega la tarea al servicio
        return await this.authService.Login(credenciales);
    }
}