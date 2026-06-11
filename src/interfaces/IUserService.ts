import UserDto from "../DTO/UserDto";

export interface IUserService{
    getUserById(id:string): Promise<UserDto>;
    updateUser(id:string, user:UserDto): Promise<UserDto>;
    deleteUser(id:string): Promise<void>;
}