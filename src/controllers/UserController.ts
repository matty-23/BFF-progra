import { Controller, Get, Param, NotFoundException, Put, Delete, Body, BadRequestException, UseGuards, Req, ForbiddenException, Inject } from '@nestjs/common';
import UserDto from '../DTO/UserDto';
import { IUserService } from '../interfaces/IUserService'
import { JwtAuthGuard } from '../guards/JwtAuthGuard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(@Inject('IUserService') private readonly _UserService: IUserService) {}

    @Get(':id')
    async getById(@Param('id') id: string, @Req() req: any): Promise<UserDto> {
        if (req.user?.idUsuario !== id) throw new ForbiddenException('No tienes permiso para ver este usuario');
        
        const user = await this._UserService.getUserById(id);
        if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        return user;
    }

    @Put(':id')
    async putUser(@Param('id') id: string, @Body() userDto: UserDto, @Req() req: any): Promise<UserDto> {
        if (req.user?.idUsuario !== id) throw new ForbiddenException('No tienes permiso para editar este usuario');
        
        try {
            return await this._UserService.updateUser(id, userDto);
        } catch (error: any) {
            throw new BadRequestException(`Error al actualizar el usuario: ${error.message}`);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Req() req: any): Promise<void> {
        if (req.user?.idUsuario !== id) throw new ForbiddenException('No tienes permiso para eliminar este usuario');
        
        try {
            await this._UserService.deleteUser(id);
        } catch (error: any) {
            throw new BadRequestException(`Error al eliminar el usuario: ${error.message}`);
        }
    }
}