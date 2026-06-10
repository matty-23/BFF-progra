import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ICarpetaClient } from '../interfaces/ICarpetaClient';
import { ComponenteDto } from '../DTO/ComponenteDto';
import { CarpetaGrpcService } from '../interfaces/CarpetaGrpcService';


@Injectable()
export class CarpetaClient implements ICarpetaClient, OnModuleInit {

    private carpetaGrpcService!: CarpetaGrpcService;

    constructor(
        @Inject('CARPETA_PACKAGE') private readonly client: ClientGrpc
    ) { }

    onModuleInit() {
        this.carpetaGrpcService = this.client.getService<CarpetaGrpcService>('CarpetaService');
    }

    async obtenerCarpetaPorId(id: string | number): Promise<ComponenteDto> {
        return await firstValueFrom(this.carpetaGrpcService.GetById({ id: String(id) }));
    }

    async obtenerCarpetasPrincipales(idUsuario: string | number) {
        const response = await firstValueFrom(
            this.carpetaGrpcService.CarpetasPrincipales({ id: String(idUsuario) })
        );


        return {
            MiArea: (response.listaUno || []).map(this.mapComponente),
            CompartidosConmigo: [],
            Recientes: [],
            Destacados: []
        };
    }

    async obtenerContenidoCarpeta(id: string | number): Promise<ComponenteDto[]> {
        const response = await firstValueFrom(
            this.carpetaGrpcService.GetComponentes({ id: String(id) })
        );
        return response.componentes || [];
    }

    // Nuevos métodos adaptados al archivo proto
    async registrarCarpeta(idPadre: string, nombre: string, idUsuario: string): Promise<ComponenteDto> {
        const request = {
            idPadre,
            carp: { nombre, idUsuario, ReadMe: "" }
        };
        return await firstValueFrom(this.carpetaGrpcService.Registrar(request));
    }

    async actualizarCarpeta(id: string, nombre: string, idUsuario: string, readMe: string): Promise<boolean> {
        const request = {
            id,
            doc: { nombre, idUsuario, ReadMe: readMe }
        };
        const response = await firstValueFrom(this.carpetaGrpcService.Actualizar(request));
        return response.success;
    }

    async eliminarCarpeta(id: string): Promise<boolean> {
        try {
            const response = await firstValueFrom(this.carpetaGrpcService.Eliminar({ id }));
            return response.success;
        } catch (error: any) {
            // Imprimimos el mensaje exacto que viene desde tu microservicio gRPC
            console.error(`❌ [gRPC Error] Falló al eliminar la carpeta (ID: ${id})`);
            console.error(`Motivo:`, error.details || error.message);

            throw error; // Dejamos que siga su curso para que el frontend se entere
        }
    }

    private mapComponente = (item: any): ComponenteDto => {
        return {
            id: item.id,
            nombre: item.nombre,
            fechaCreacion: item.fechaCreacion,
            fechaUltimaModificacion: item.fechaUltimaModificacion,
            idUsuario: item.idUsuario,
            ReadMe: item.ReadMe,
            tipo: item.tipo,
            componentes: (item.componentes || []).map(this.mapComponente),
        };
    }
}