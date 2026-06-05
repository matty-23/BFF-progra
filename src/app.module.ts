// src/app.module.ts
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './controllers/UserController';
import { AuthController } from './controllers/AuthController';
import UserService from './services/UserService';
import UserProfile from './clients/UserProfile';
import { AuthService } from './services/AuthService';
import { AuthClient } from './clients/AuthClient';
import { TokenMiddleware } from './middlewares/TokenMiddleware';
import { CarpetaController } from './controllers/CarpetaController';
import { CarpetasCacheService } from './services/CarpetaService';
import { CarpetaClient } from './clients/CarpetaClient';
import { MongooseModule } from '@nestjs/mongoose';
import { CarpetaCache, CarpetaCacheSchema } from './schemas/schemaCarpeta';
import { CarpetaCacheRepository } from './repository/CarpetaRepository';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    MongooseModule.forFeature([
      { name: CarpetaCache.name, schema: CarpetaCacheSchema },
    ]),
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), 'src/proto/auth.proto'), 
          url: process.env.GRPC_AUTH_URL, 
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'CARPETA_PACKAGE', 
        transport: Transport.GRPC,
        options: {
          package: 'carpetas', 
          protoPath: join(process.cwd(), 'src/proto/carpeta.proto'), 
          url: 'localhost:50053', 
        },
      },
    ]),
  ],
  controllers: [UserController, AuthController, CarpetaController],
  providers: [
    // 👇 Eliminé el "CarpetasCacheService" que estaba suelto aquí arriba
    {
      provide: 'ICarpetaCacheRepository',
      useClass: CarpetaCacheRepository,
    },
    AuthClient,
    CarpetaClient,
    {
      provide: 'IAuthService',
      useClass: AuthService, 
    },
    {
      provide: 'IUserService',
      useClass: UserService, 
    },
    {
      provide: 'IUserClient',
      useClass: UserProfile, 
    },
    {
      provide: 'ICarpetaService', // El controlador pide esto
      useClass: CarpetasCacheService // NestJS entrega tu única clase
    },
    {
      provide: 'ICarpetaClient',   
      useClass: CarpetaClient     
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('*');
  }
}