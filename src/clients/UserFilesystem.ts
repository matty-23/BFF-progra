/* import axios from 'axios';

export class UserFilesystem {
    private client = axios.create({ baseURL: process.env.CORE_BACKEND_URL });

    async getCarpetaCompleta(id: string) {
        // Ejecuta ambas peticiones en paralelo para optimizar
        const [carpeta, hijos] = await Promise.all([
            this.client.get(`/api/Carpetas/${id}`),
            this.client.get(`/api/Carpetas/${id}/hijos`)
        ]);
        return { carpeta: carpeta.data, hijos: hijos.data };
    }
} */