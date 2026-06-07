import { Injectable, Inject, Logger } from '@nestjs/common';
import { ICarpetaCacheRepository } from '../interfaces/ICarpetaRepository';
import { CarpetaClient } from '../clients/CarpetaClient';
import { ICarpetaService } from '../interfaces/ICarpetaService';

@Injectable()
export class CarpetasCacheService implements ICarpetaService {
    private readonly logger = new Logger(CarpetasCacheService.name);

    constructor(@Inject('ICarpetaCacheRepository')private readonly cacheRepo: ICarpetaCacheRepository, @Inject('ICarpetaClient')private readonly carpetaClient: CarpetaClient) {}

    async obtenerCarpetaPorId(id: any): Promise<any> {
        return this.carpetaClient.obtenerCarpetaPorId(id);
    }

    async obtenerCarpetasPrincipales(data: { id: string }): Promise<any> {
        const request = { id: String(data.id) };
        const cacheKey = this.buildKey(request.id);
        
        const cached = await this.cacheRepo.findByCacheKey(cacheKey);
        if (cached) {
            this.logger.debug(`Cache HIT para usuario ${request.id}`);
            return cached;
        }
        
        this.logger.debug(`Cache MISS para usuario ${request.id}, consultando backend`);
        const response = await this.carpetaClient.obtenerCarpetasPrincipales(request.id);
        const cache_seconds=300;
        await this.cacheRepo.upsert(cacheKey, request.id, response, cache_seconds);
        return response;
    }

    async invalidarCacheUsuario(idUsuario: string): Promise<void> {
        this.logger.log(`Invalidando caché para usuario ${idUsuario}`);
        await this.cacheRepo.deleteByUsuario(idUsuario);
    }

    async obtenerContenidoCarpeta(id: any): Promise<any> {
        return this.carpetaClient.obtenerContenidoCarpeta(id);
    }

    async crearCarpeta(idPadre: string, nombre: string, idUsuario: string): Promise<any> {
        const nuevaCarpeta = await this.carpetaClient.registrarCarpeta(idPadre, nombre, idUsuario);
        await this.invalidarCacheUsuario(idUsuario);
        return nuevaCarpeta;
    }

    async actualizarCarpeta(id: string, nombre: string, idUsuario: string, readMe: string): Promise<any> {
        const resultado = await this.carpetaClient.actualizarCarpeta(id, nombre, idUsuario, readMe);
        await this.invalidarCacheUsuario(idUsuario);
        return resultado;
    }

    async eliminarCarpeta(id: string, idUsuario: string): Promise<any> {
        const resultado = await this.carpetaClient.eliminarCarpeta(id);
        await this.invalidarCacheUsuario(idUsuario);
        return resultado;
    }

    private buildKey(idUsuario: string): string {
        return `principales:${idUsuario}`;
    }
}