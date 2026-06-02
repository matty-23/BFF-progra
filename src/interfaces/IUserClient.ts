import User from '../viewModels/User';
import UserDto from '../DTO/UserDto';

export default interface IUserClient {
    getById(id:string): Promise<User>;
    create(user:UserDto): Promise<User>;
    updateById(id:string, user:UserDto): Promise<boolean>;
    deleteById(id:string): Promise<void>;
}