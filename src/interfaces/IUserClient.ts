import User from '../viewModels/User.js';
import UserDto from '../DTO/UserDto.js';

export default interface IUserClient {
    getById(id:string): Promise<User>;
    create(user:UserDto): Promise<User>;
    updateById(id:string, user:UserDto): Promise<User>;
    deleteById(id:string): Promise<void>;
}