import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class DocumentoDTO {
    @IsString()
    @IsOptional()
    readonly id?: string;

    @IsString()
    @IsOptional()
    readonly nombre?: string;

    @IsString()
    @IsOptional()
    readonly contenido?: string;

    @IsString()
    @IsOptional()
    readonly idUsuario?: string;

    @IsDateString()
    @IsOptional()
    readonly fechaCreacion?: Date;

    @IsDateString()
    @IsOptional()
    readonly fechaModificacion?: Date;

    @IsString()
    @IsOptional()
    readonly estado?: string;
}

export class CrearDocumentoDTO {
    @IsString()
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    readonly idUsuario!: string;

    @IsString()
    @IsOptional()
    readonly nombre?: string;

    @IsString()
    @IsOptional()
    readonly estado?: string;
}