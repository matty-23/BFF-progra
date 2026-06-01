import { Controller, Get, Param, NotFoundException, Post, Body, BadRequestException, HttpCode, Put, Delete, Patch } from '@nestjs/common';
import UserDto from '../DTO/UserDto.js';
import { IUserService } from '../interfaces/IUserService.js'
import { Inject } from '@nestjs/common';

@Controller('api/users')
export class UserController{
    constructor(@Inject('IUserService') private readonly _UserService: IUserService){}

    @Get(':id')
    async getById(@Param('id') id: string): Promise<UserDto> {
        const user = await this._UserService.getUserById(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }
        return user;
    }

    @Patch(':id')
    async patchUser(@Param('id') id: string, @Body() userDto: UserDto): Promise<UserDto> {
        try {
            const updatedUser = await this._UserService.updateUser(id, userDto);
            return updatedUser;
        } catch (error: any) {
            throw new BadRequestException(`Error al actualizar el usuario: ${error.message}`);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<void> {
        try {
            await this._UserService.deleteUser(id);
        } catch (error: any) {
            throw new BadRequestException(`Error al eliminar el usuario: ${error.message}`);
        }
    }

}