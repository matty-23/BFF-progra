export interface ICarpetaService {
    obtenerCarpetasPrincipales(data: { id: string }): Promise<any>;
    obtenerContenidoCarpeta(id: any): Promise<any>;
    invalidarCacheUsuario(idUsuario: string): Promise<void>;
    crearCarpeta(idPadre: string, nombre: string, idUsuario: string): Promise<any>;
    actualizarCarpeta(id: string, nombre: string, idUsuario: string, readMe: string): Promise<any>;
    eliminarCarpeta(id: string, idUsuario: string): Promise<any>;
}