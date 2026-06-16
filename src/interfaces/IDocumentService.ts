export interface IDocumentosService {
    obtenerDocumentoPorId(id: string): Promise<any>;
    crearDocumento(idCarpeta: string, nombre: string, idUsuario: string): Promise<any>;
    actualizarDocumento(id: string, nombre: string, idUsuario: string, contenido: string): Promise<any>;
    eliminarDocumento(id: string, idUsuario: string): Promise<any>;
}