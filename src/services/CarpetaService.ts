import { Injectable, Inject, Logger } from '@nestjs/common';
import { ICarpetaCacheRepository } from '../interfaces/ICarpetaRepository';
// Eliminamos la importación de ICarpetaService del constructor
import { ICarpetaClient } from '../interfaces/ICarpetaClient';
import { Observable } from 'rxjs';
import { ICarpetaService } from '../interfaces/ICarpetaService';

const CACHE_TTL_SECONDS = parseInt(process.env.CARPETAS_CACHE_TTL ?? '300', 10);

@Injectable()
export class CarpetasCacheService implements ICarpetaService {
    private readonly logger = new Logger(CarpetasCacheService.name);

    constructor(
        @Inject('ICarpetaCacheRepository')
        private readonly cacheRepo: ICarpetaCacheRepository,

        // 👇 Eliminamos la inyección circular y dejamos SOLO el cliente gRPC
        @Inject('ICarpetaClient')
        private readonly carpetaClient: ICarpetaClient
    ) {}

    async obtenerCarpetaPorId(id: any): Promise<any> {
        this.logger.debug(`Consultando carpeta por ID ${id} directamente al backend (sin caché)`);
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
        // Aquí esperamos (await) a que tu cliente gRPC responda
        const response = await this.carpetaClient.obtenerCarpetasPrincipales(request.id);
        
        await this.cacheRepo.upsert(cacheKey, request.id, response, CACHE_TTL_SECONDS);
        return response;
    }

    async invalidarCacheUsuario(idUsuario: string): Promise<void> {
        this.logger.log(`Invalidando caché para usuario ${idUsuario}`);
        await this.cacheRepo.deleteByUsuario(idUsuario);
    }

    private buildKey(idUsuario: string): string {
        return `principales:${idUsuario}`;
    }

    async obtenerContenidoCarpeta(id: any): Promise<any> {
        this.logger.debug(`Consultando contenido de la carpeta ${id} directamente al backend (sin caché)`);
        return this.carpetaClient.obtenerContenidoCarpeta(id);
    }
}