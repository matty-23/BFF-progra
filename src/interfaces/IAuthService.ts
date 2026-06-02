export interface IAuthService{
    Login(credenciales: any): Promise<any>;
    LoginOut(credenciales: any): Promise<any>;
    Register(credenciales: any): Promise<any>;
}