export interface ICarpetaClient {
    obtenerCarpetaPorId(id: any): Promise<any>;
    obtenerCarpetasPrincipales(idUsuario: any): Promise<{ MiArea: any, CompartidosConmigo: any[], Recientes: any[], Destacados: any[] }>;
    obtenerContenidoCarpeta(id: any): Promise<any>;
}