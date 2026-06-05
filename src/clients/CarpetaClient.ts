import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ICarpetaClient } from '../interfaces/ICarpetaClient';
import { Observable } from 'rxjs';

interface CarpetaGrpcService {
    GetById(data: { id: string }): Observable<any>;
    CarpetasPrincipales(data: { id: string }): Observable<any>;
    GetComponentes(data: { id: string }): Observable<any>;
}

@Injectable()
export class CarpetaClient implements ICarpetaClient, OnModuleInit {
    
    private carpetaGrpcService!: CarpetaGrpcService;

    constructor(
        @Inject('CARPETA_PACKAGE') private readonly client: ClientGrpc
    ) {}

    onModuleInit() {
        this.carpetaGrpcService = this.client.getService<CarpetaGrpcService>('CarpetaService');
    }

    async obtenerCarpetaPorId(id: any): Promise<any> {
        const request = { id: String(id) };
        const response = await lastValueFrom(this.carpetaGrpcService.GetById(request));
        return response;
    }

// Tipamos el retorno para que sea claro qué devuelve


async obtenerCarpetasPrincipales(idUsuario: string | number): Promise<any> {
    const request = { id: String(idUsuario) };
    const response = await lastValueFrom(this.carpetaGrpcService.CarpetasPrincipales(request));
    
    return {
        MiArea: (response.listaUno || []).map(mapComponente),
        CompartidosConmigo: [], // Por ahora vacío hasta que actualices el proto
        Recientes: [],
        Destacados: []
    }; 
}
    

    async obtenerContenidoCarpeta(id: any): Promise<any[]> {
        const request = { id: String(id) };
        const response = await lastValueFrom(this.carpetaGrpcService.GetComponentes(request));
        
        return response.componentes || [];
    }
    
}
function mapComponente(item: any): any {
    return {
        id: item.id,
        nombre: item.nombre,
        fechaCreacion: item.fechaCreacion,
        fechaUltimaModificacion: item.fechaUltimaModificacion,
        idUsuario: item.idUsuario,
        ReadMe: item.ReadMe,
        componentes: (item.componentes || []).map(mapComponente),
    };}