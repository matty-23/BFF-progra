import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, Inject, Req, ForbiddenException } from '@nestjs/common';
import { ICarpetaService } from '../interfaces/ICarpetaService';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';


@Controller('api/carpetas')
@UseGuards(JwtAuthGuard)
export class CarpetaController {
    constructor(@Inject('ICarpetaService')private readonly carpetaService: ICarpetaService) { }

    @Get('carpetas-principales/:idUsuario')
    async obtenerCarpetasPrincipales(@Param('idUsuario') idUsuario: string,@Req() req: any) {
        if (req.user?.idUsuario !== idUsuario) throw new ForbiddenException('Acceso denegado');
        return await this.carpetaService.obtenerCarpetasPrincipales({ id: idUsuario });
    }

    @Get(':id')
    async obtenerCarpetaPorId(@Param('id') id: string) {
        return await this.carpetaService.obtenerCarpetaPorId(id);
    }

    @Get('contenido/:id')
    async obtenerContenidoCarpeta(@Param('id') id: string) {
        return await this.carpetaService.obtenerContenidoCarpeta(id);
    }

    @Post(':idPadre')
    @HttpCode(HttpStatus.CREATED)
    async crearCarpeta(@Param('idPadre') idPadre: string,@Body() body: { nombre: string }, @Req() req: any) {
        return await this.carpetaService.crearCarpeta(idPadre, body.nombre, req.user.idUsuario);
    }

    @Put(':id')
    async actualizarCarpeta(@Param('id') id: string,@Body() body: { nombre: string, readme: string },@Req() req: any) {
        return await this.carpetaService.actualizarCarpeta(id, body.nombre, req.user.idUsuario, body.readme);
    }

    @Delete(':id/usuario/:idUsuario')
    @HttpCode(HttpStatus.OK)
    async eliminarCarpeta(@Param('id') id: string,@Req() req: any) {
        return await this.carpetaService.eliminarCarpeta(id, req.user.idUsuario);
    }

    @Delete('cache/invalidar/:idUsuario')
    @HttpCode(HttpStatus.NO_CONTENT)
    async invalidarCache(@Param('idUsuario') idUsuario: string) {
        await this.carpetaService.invalidarCacheUsuario(idUsuario);
    }
}