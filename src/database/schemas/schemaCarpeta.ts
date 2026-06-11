import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
 
export type CarpetaCacheDocument = CarpetaCache & Document;
 
@Schema({ collection: 'carpetas_cache' })
export class CarpetaCache {
    // Agregamos "!" a las propiedades sin default
    @Prop({ required: true, unique: true, index: true })
    cacheKey!: string;
 
    @Prop({ required: true, type: Object })
    data!: {
        MiArea: any[];
        CompartidosConmigo: any[];
        Recientes: any[];
        Destacados: any[];
    };
 
    @Prop({ required: true })
    idUsuario!: string;
 
    @Prop({ required: true, default: Date.now })
    creadoEn!: Date; // También se lo puedes poner a las que tienen default por si acaso
 
    @Prop({ required: true, index: { expireAfterSeconds: 0 } })
    expiresAt!: Date;
}
 
export const CarpetaCacheSchema = SchemaFactory.createForClass(CarpetaCache);