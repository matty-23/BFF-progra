import IUserClient from '../interfaces/IUserClient.js';
import User from '../viewModels/User.js';
import UserDto from '../DTO/UserDto.js';
import { requestContext } from '../database/context/RequestContext';

export default class UserProfile implements IUserClient {
    private getAuthHeaders(): HeadersInit {
        const store = requestContext.getStore();
        const token = store?.get('token');
        
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }

    async getById(id: string): Promise<User> {
        try {
            const response = await fetch(`${process.env.BASE_URL}/Usuarios/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders() // Inyectamos los headers dinámicos
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Usuario con ID ${id} no encontrado en el sistema.`);
                }
                if (response.status === 401 || response.status === 403) {
                    throw new Error('No tienes permisos para acceder a este perfil.');
                }
                throw new Error(`Error en el servidor Core: ${response.statusText}`);
            }

            const rawData: User = await response.json();

            return rawData;

        } catch (error: any) {
            console.error(`[UserProfile Client] Fallo al obtener el usuario ${id}:`, error.message);
            throw error; 
        }
    }
     async create(user:UserDto): Promise<User>{
          try{
               const response = await fetch(`${process.env.BASE_URL}/Usuarios/${user.id}`, {
                method: 'POST',
                headers: this.getAuthHeaders(), 
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(`Faltan datos para crear el usuario.`);
                }
                if (response.status === 409) {
                    throw new Error(`El usuario ya existe.`);
                }
                throw new Error(`Error en el servidor Core: ${response.statusText}`);
            }
            const newUser : User = await response.json();
            return newUser;
          }
          catch(error:any){
               throw error; 
          }
     }
     async updateById(id:string, user:UserDto): Promise<boolean>{
          try{
               const response = await fetch(`${process.env.BASE_URL}/Usuarios/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    username: user.username
                })
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Usuario con ID ${user.id} no encontrado en el sistema.`);
                }
                throw new Error(`Error en el servidor Core: ${response.statusText}`);
            }
            return true;
          }
          catch(error:any){
               throw error; 
          }
     }
     async deleteById(id:string): Promise<void>{
         try{
               const response = await fetch(`${process.env.BASE_URL}/Usuarios/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Usuario con ID ${id} no encontrado en el sistema.`);
                }
                throw new Error(`Error en el servidor Core: ${response.statusText}`);
            }
          }
          catch(error:any){
               throw error; 
          }
     }
}