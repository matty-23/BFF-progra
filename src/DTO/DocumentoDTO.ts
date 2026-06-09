export class DocumentoDTO {
    readonly id!: number;
    readonly nombre!: string;
    readonly contenido!: string;
    readonly idCarpeta!: number;
    readonly idUsuario!: number;
    readonly fechaCreacion?: Date;
    readonly fechaModificacion?: Date;
}