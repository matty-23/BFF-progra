import { Controller, Post, Body, HttpCode, HttpStatus, Inject, Res, Req, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from '../interfaces/IAuthService';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('api/auth')
export class AuthController {
    constructor(@Inject('IAuthService') private readonly authService: IAuthService) {}
    
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() credenciales: any, @Res({ passthrough: true }) res: FastifyReply) {
        const authData = await this.authService.Login(credenciales);
        
        this.setRefreshCookie(res, authData.refreshToken);

        return {
            accessToken: authData.accessToken,
            idUsuario: authData.idUsuario,
            username: authData.username
        };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) throw new UnauthorizedException('Sesión no encontrada');
        
        const authData = await this.authService.Refresh(refreshToken);
        if (authData.refreshToken) this.setRefreshCookie(res, authData.refreshToken);
        
        return { accessToken: authData.accessToken };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: FastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
        const refreshToken = req.cookies['refreshToken'];
        if (refreshToken) {
            await this.authService.LoginOut({ token: refreshToken });
        }
        
        res.clearCookie('refreshToken', { path: '/api/auth' });
        return { message: 'Logout exitoso' };
    }

    @Post('register')
    async register(@Body() credenciales: any) {
        const resultado = await this.authService.Register(credenciales);
        return { message: 'Registro exitoso', data: resultado };
    }

    private setRefreshCookie(res: FastifyReply, token: string) {
        res.setCookie('refreshToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth',
            maxAge: 7 * 24 * 60 * 60
        });
    }
}