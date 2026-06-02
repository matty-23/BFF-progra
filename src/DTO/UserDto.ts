export default class UserDto{
    readonly id!:string;
    readonly nombre!:string;
    readonly email!:string;
    readonly username!:string;
    //la url deberia ser un endpoint del backend solo para eso
    readonly profileUrl!:string; 
}