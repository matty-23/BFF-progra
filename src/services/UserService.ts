import UserDto from '../DTO/UserDto';
import { IUserService } from '../interfaces/IUserService';
import IUserClient from '../interfaces/IUserClient';
import { Inject } from '@nestjs/common/decorators/core/index';

export default class UserService implements IUserService{
    constructor(@Inject('IUserClient') private readonly _UserClient: IUserClient){}

    async getUserById(id: string): Promise<UserDto> {
        const user = await this._UserClient.getById(id);
        const userDto: UserDto ={
            id: user.getId(),
            nombre: user.getNombre(),
            apellido: user.getApellido(),
            email: user.getEmail(),
            username: user.getUsername(),
            fechaCreacion: user.getFechaCreacion()
        }
        return userDto;

    }

    async updateUser(id: string, user: UserDto): Promise<UserDto> {
        const updatedUser = await this._UserClient.updateById(id, user);
        if (!updatedUser) {
            throw new Error(`No se pudo actualizar el usuario con ID ${id}.`);
        }

        return await this.getUserById(id);
    }
    async deleteUser(id: string): Promise<void> {
        await this._UserClient.deleteById(id);
    }
} 