import { DocumentoDTO, CrearDocumentoDTO } from "../DTO/DocumentoDTO";
export default interface IDocumentBDClient {
    obtenerMetadataDocumentoPorId(id: string): Promise<any>;
    crearMetadataDocumento( idPadre: string, doc: CrearDocumentoDTO): Promise<any>;
    actualizarMetadataDocumento(idPadre: string, doc: DocumentoDTO): Promise<any>;
    eliminarMetadataDocumento(id: string, idUsuario: string): Promise<any>;
}