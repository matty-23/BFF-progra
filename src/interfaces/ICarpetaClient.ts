export interface ICarpetaClient {
    obtenerCarpetaPorId(id: any): Promise<any>;
    obtenerCarpetasPrincipales(idUsuario: any): Promise<{ MiArea: any, CompartidosConmigo: any[], Recientes: any[], Destacados: any[] }>;
    obtenerContenidoCarpeta(id: any): Promise<any>;
    registrarCarpeta(idPadre: string, nombre: string, idUsuario: string): Promise<any>;
    actualizarCarpeta(id: string, nombre: string, idUsuario: string, readMe: string): Promise<any>;
    eliminarCarpeta(id: string): Promise<any>;
}