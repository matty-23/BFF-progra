import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CarpetaCache, CarpetaCacheDocument } from '../schemas/schemaCarpeta';
import { ICarpetaCacheRepository } from '../../interfaces/ICarpetaRepository';
 
@Injectable()
export class CarpetaCacheRepository implements ICarpetaCacheRepository {
    constructor(
        @InjectModel(CarpetaCache.name)
        private readonly cacheModel: Model<CarpetaCacheDocument>,
    ) {}
 
    async findByCacheKey(cacheKey: string): Promise<any | null> {
        const entry = await this.cacheModel
            .findOne({ cacheKey, expiresAt: { $gt: new Date() } })
            .lean()
            .exec();
 
        return entry?.data ?? null;
    }
 
    async upsert(
        cacheKey: string,
        idUsuario: string,
        data: any,
        ttlSeconds: number,
    ): Promise<void> {
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
 
        await this.cacheModel.findOneAndUpdate(
            { cacheKey },
            {
                $set: {
                    cacheKey,
                    idUsuario,
                    data,
                    creadoEn: new Date(),
                    expiresAt,
                },
            },
            { upsert: true, new: true },
        );
    }
 
    async deleteByUsuario(idUsuario: string): Promise<void> {
        await this.cacheModel.deleteMany({ idUsuario }).exec();
    }
 
    async clearAll(): Promise<void> {
        await this.cacheModel.deleteMany({}).exec();
    }
}