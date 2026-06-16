import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { requestContext } from '../database/context/RequestContext';
import { ICarpetaClient } from '../interfaces/ICarpetaClient';
import { ComponenteDto } from '../DTO/ComponenteDto';
import { CarpetaGrpcService } from '../interfaces/CarpetaGrpcService';

@Injectable()
export class CarpetaClient implements ICarpetaClient, OnModuleInit {

    private carpetaGrpcService!: CarpetaGrpcService;

    constructor(@Inject('CARPETA_PACKAGE') private readonly client: ClientGrpc) { }

    onModuleInit() { this.carpetaGrpcService = this.client.getService<CarpetaGrpcService>('CarpetaService'); }

    private getGrpcMetadata(): Metadata {
        const store = requestContext.getStore();
        const token = store?.get('token');
        const metadata = new Metadata();
        if (token) {
            metadata.add('authorization', `Bearer ${token}`);
        }
        return metadata;
    }

    async obtenerCarpetaPorId(id: string | number): Promise<ComponenteDto> {
        const metadata = this.getGrpcMetadata();
        return await firstValueFrom(
            this.carpetaGrpcService.GetById({ id: String(id) }, metadata)
        );
    }

    async obtenerCarpetasPrincipales(idUsuario: string | number) {
        const metadata = this.getGrpcMetadata();
        const response = await firstValueFrom(this.carpetaGrpcService.CarpetasPrincipales({ id: String(idUsuario) }, metadata));

        const todasLasRaices = response.carpetasPrincipales || [];

        const miAreaCarpeta = todasLasRaices.find(c => c.nombre === "Mi Area");
        const compartidosCarpeta = todasLasRaices.find(c => c.nombre === "Compartidos conmigo");
        const recientesCarpeta = todasLasRaices.find(c => c.nombre === "Recientes");
        const destacadosCarpeta = todasLasRaices.find(c => c.nombre === "Destacados");

        return {
            MiArea: miAreaCarpeta ? [this.mapComponente(miAreaCarpeta)] : [],
            CompartidosConmigo: compartidosCarpeta ? [this.mapComponente(compartidosCarpeta)] : [],
            Recientes: recientesCarpeta ? [this.mapComponente(recientesCarpeta)] : [],
            Destacados: destacadosCarpeta ? [this.mapComponente(destacadosCarpeta)] : []
        };
    }

    async obtenerContenidoCarpeta(id: string | number): Promise<ComponenteDto[]> {
        const metadata = this.getGrpcMetadata();
        const response = await firstValueFrom(
            this.carpetaGrpcService.GetComponentes({ id: String(id) }, metadata)
        );
        return response.componentes || [];
    }

    async registrarCarpeta(idPadre: string, nombre: string, idUsuario: string): Promise<ComponenteDto> {
        const metadata = this.getGrpcMetadata();
        const request = {
            idPadre,
            carp: { nombre, idUsuario, ReadMe: "" }
        };
        return await firstValueFrom(this.carpetaGrpcService.Registrar(request, metadata));
    }

    async actualizarCarpeta(id: string, nombre: string, idUsuario: string, readMe: string): Promise<boolean> {
        const metadata = this.getGrpcMetadata();
        const request = { id, carp: { nombre, idUsuario, ReadMe: readMe } };
        const response = await firstValueFrom(this.carpetaGrpcService.Actualizar(request, metadata));
        return response.success;
    }

    async eliminarCarpeta(id: string): Promise<boolean> {
        try {
            const metadata = this.getGrpcMetadata();
            const response = await firstValueFrom(this.carpetaGrpcService.Eliminar({ id }, metadata));
            return response.success;
        } catch (error: any) {
            console.error(`Motivo:`, error.details || error.message);
            throw error;
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