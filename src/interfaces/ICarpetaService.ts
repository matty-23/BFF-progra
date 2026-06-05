import { Controller } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
export interface ICarpetaService {
    // Fíjate que le quitamos los [] a "any" en MiArea
    obtenerCarpetasPrincipales(data: { id: string  }): Promise<any>;
    obtenerContenidoCarpeta(id: any): Promise<any>;
    invalidarCacheUsuario(idUsuario: string): Promise<void>;
}