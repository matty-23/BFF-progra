import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export default class UserDto {
    @IsString({ message: 'El id debe ser texto' })
    @IsNotEmpty({ message: 'El id es obligatorio' })
    readonly id!: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    readonly nombre!: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    readonly apellido!: string;

    @IsEmail({}, { message: 'El formato de email no es válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    readonly email!: string;

    @IsString()
    @IsNotEmpty({ message: 'El username es obligatorio' })
    readonly username!: string;

    @IsDateString({}, { message: 'La fecha de creación debe ser un formato ISO 8601' })
    @IsOptional()
    readonly fechaCreacion!: Date;
}