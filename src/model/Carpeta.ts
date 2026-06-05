export class Carpeta {
    private  _id: string;
    private nombre: string;
    private fechaCreacion: Date;
    private fechaUltimaModificacion: Date;
    private idUsuario: string;
    private componentes: Carpeta[];
    private ReadMe: string;
    private ruta: string;

    constructor(_id: string, nombre: string, fechaCreacion: Date, fechaUltimaModificacion: Date, idUsuario: string, ReadMe: string, componentes? : Carpeta[]) {
        this._id = _id;
        this.nombre = nombre;
        this.fechaCreacion = fechaCreacion;
        this.fechaUltimaModificacion = fechaUltimaModificacion;
        this.idUsuario = idUsuario;
        this.componentes = componentes || [];
        this.ReadMe = ReadMe;
        this.ruta = "";
    }
}