import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, Inject, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { IDocumentosService } from '../interfaces/IDocumentService';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';

@Controller('api/documentos')
@UseGuards(JwtAuthGuard)
export class DocumentController {
    constructor(@Inject('IDocumentosService') private readonly documentosService: IDocumentosService) { }

    @Get(':id')
    async obtenerDocumentoPorId(@Param('id') id: string) {
        return await this.documentosService.obtenerDocumentoPorId(id);
    }

    @Post(':idCarpeta')
    @HttpCode(HttpStatus.CREATED)
    async crearDocumento(@Param('idCarpeta') idCarpeta: string,@Body() body: { nombre: string }, @Req() req: any) {
        return await this.documentosService.crearDocumento(idCarpeta, body.nombre, req.user.idUsuario);
    }

    @Put(':id')
    async actualizarDocumento(@Param('id') id: string,@Body() body: { nombre: string, contenido: string }, @Req() req: any) {
        return await this.documentosService.actualizarDocumento(id, body.nombre, req.user.idUsuario, body.contenido);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async eliminarDocumento(@Param('id') id: string,@Req() req: any) {
        return await this.documentosService.eliminarDocumento(id);
    }
}