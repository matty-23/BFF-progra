import { IsNumber, IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CarpetaDTO {
    @IsNumber()
    @IsOptional()
    readonly id!: number;

    @IsString()
    @IsNotEmpty({ message: 'El nombre de la carpeta es obligatorio' })
    readonly nombre!: string;

    @IsString()
    @IsOptional()
    readonly readme!: string;

    @IsNumber()
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    readonly idUsuario!: number;

    @IsArray()
    @IsOptional()
    readonly contenido!: any[];
}