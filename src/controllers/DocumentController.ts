import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, Inject, UseInterceptors } from '@nestjs/common';
import { IDocumentosService } from '../interfaces/IDocumentService';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';

@Controller('api/documentos')
@UseGuards(JwtAuthGuard)
export class DocumentController {
    constructor(@Inject('IDocumentosService')private readonly documentosService: IDocumentosService) { }


    @Get(':id')
    async obtenerDocumentoPorId(@Param('id') id: string) {
        return await this.documentosService.obtenerDocumentoPorId(id);
    }

    @Post(':idCarpeta')
    @HttpCode(HttpStatus.CREATED)
    async crearDocumento(
        @Param('idCarpeta') idCarpeta: string,
        @Body() body: { nombre: string, idUsuario: string }
    ) {
        return await this.documentosService.crearDocumento(idCarpeta, body.nombre, body.idUsuario);
    }

    @Put(':id')
    async actualizarDocumento(
        @Param('id') id: string,
        @Body() body: { nombre: string, idUsuario: string, contenido: string }
    ) {
        return await this.documentosService.actualizarDocumento(id, body.nombre, body.idUsuario, body.contenido);
    }

    @Delete(':id/usuario/:idUsuario')
    @HttpCode(HttpStatus.OK)
    async eliminarDocumento(
        @Param('id') id: string,
        @Param('idUsuario') idUsuario: string
    ) {
        return await this.documentosService.eliminarDocumento(id, idUsuario);
    }






}