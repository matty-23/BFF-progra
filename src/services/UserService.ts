import UserDto from '../DTO/UserDto.js';
import { IUserService } from '../interfaces/IUserService.js';
import IUserClient from '../interfaces/IUserClient.js';
import { Inject } from '@nestjs/common/decorators/core/index.js';

export default class UserService implements IUserService{
    constructor(@Inject('IUserClient') private readonly _UserClient: IUserClient){}

    async getUserById(id: string): Promise<UserDto> {
        const user = await this._UserClient.getById(id);
        const userDto: UserDto ={
            id: user.getId(),
            nombre: user.getNombre(),
            email: user.getEmail(),
            username: user.getUsername(),
            profileUrl: `http://localhost:3000/api/users/${user.getId()}/profile`
        }
        return userDto;

    }
    async createUser(user: UserDto): Promise <UserDto>{
        const newUser= await this._UserClient.create(user);
        const userDto: UserDto ={
            id: newUser.getId(),
            nombre: newUser.getNombre(),
            email: newUser.getEmail(),
            username: newUser.getUsername(),
            profileUrl: `http://localhost:3000/api/users/${newUser.getId()}/profile`
        }
        return userDto;
    }

    async updateUser(id: string, user: UserDto): Promise<UserDto> {
        const updatedUser = await this._UserClient.updateById(id, user);
        const userDto: UserDto ={
            id: updatedUser.getId(),
            nombre: updatedUser.getNombre(),
            email: updatedUser.getEmail(),
            username: updatedUser.getUsername(),
            profileUrl: `http://localhost:3000/api/users/${updatedUser.getId()}/profile`
        }
        return userDto;
    }
    async deleteUser(id: string): Promise<void> {
        await this._UserClient.deleteById(id);
    }
} 