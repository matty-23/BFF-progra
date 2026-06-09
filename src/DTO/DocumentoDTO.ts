export class DocumentoDTO {
    readonly id?: string;
    readonly nombre?: string;
    readonly contenido?: string;
    readonly idUsuario?: string;
    readonly fechaCreacion?: Date;
    readonly fechaModificacion?: Date;
    readonly estado?:string;
}
export class CrearDocumentoDTO {
    readonly idUsuario!: string;
    readonly nombre?: string;
    readonly estado?: string;
}