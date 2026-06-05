import { Controller, Get, Post, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ICarpetaService } from '../interfaces/ICarpetaService';
import { CarpetasCacheService } from '../services/CarpetaService';
import { lastValueFrom, Observable } from 'rxjs';
 
@Controller('api/carpetas')
export class CarpetaController {
constructor(
        @Inject('ICarpetaService')
        private readonly carpetaService: ICarpetaService
    ) {}
 

@Get('carpetas-principales/:idUsuario') // ¡Faltaba esto!
async obtenerCarpetasPrincipales(@Param('idUsuario') idUsuario: string) {
    return await this.carpetaService.obtenerCarpetasPrincipales({ id: idUsuario });
}
 

    @Get('contenido/:id')
    async obtenerContenidoCarpeta(@Param('id') id: string) {
        try {
            return await this.carpetaService.obtenerContenidoCarpeta(id);
        } catch (error: any) {
            throw new Error(`Error al obtener el contenido de la carpeta: ${error.message}`);
        }
    }
 

    @Delete('cache/invalidar/:idUsuario')
    @HttpCode(HttpStatus.NO_CONTENT)
    async invalidarCache(@Param('idUsuario') idUsuario: string) {
        await this.carpetaService.invalidarCacheUsuario(idUsuario);
    }
}