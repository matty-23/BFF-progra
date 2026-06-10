export interface ComponenteDto {
    id: string;
    nombre: string;
    fechaCreacion: string;
    fechaUltimaModificacion: string;
    idUsuario: string;
    tipo?: string;
    ReadMe?: string;
    componentes?: ComponenteDto[];
}
