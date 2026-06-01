import UserDto from '../DTO/UserDto.js';
import { IUserService } from '../interfaces/IUserService.js';
import IUserClient from '../interfaces/IUserClient.js';
import { Inject } from '@nestjs/common/decorators/core/index.js';

export default class UserService implements IUserService{
    constructor(@Inject('IUserClient') private readonly _UserClient: IUserClient){}

    async getUserById(id: string): Promise<UserDto> {
        const user = await this._UserClient.getById(id);
        const userDto: UserDto ={
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            username: user.username,
            profileUrl: `http://localhost:3000/api/users/${user.id}/profile`
        }
        return userDto;

    }
    async createUser(user: UserDto): Promise <UserDto>{
        const newUser= await this._UserClient.create(user);
        const userDto: UserDto ={
            id: newUser.id,
            nombre: newUser.nombre,
            email: newUser.email,
            username: newUser.username,
            profileUrl: `http://localhost:3000/api/users/${newUser.id}/profile`
        }
        return userDto;
    }

    async updateUser(id: string, user: UserDto): Promise<UserDto> {
        const updatedUser = await this._UserClient.updateById(id, user);
        const userDto: UserDto ={
            id: updatedUser.id,
            nombre: updatedUser.nombre,
            email: updatedUser.email,
            username: updatedUser.username,
            profileUrl: `http://localhost:3000/api/users/${updatedUser.id}/profile`
        }
        return userDto;
    }
    async deleteUser(id: string): Promise<void> {
        await this._UserClient.deleteById(id);
    }
} 