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
import { CarpetaCache, CarpetaCacheSchema } from './database/schemas/schemaCarpeta';
import { CarpetaCacheRepository } from './database/repository/CarpetaRepository';
import { DocumentController } from './controllers/DocumentController';
import { DocumentoService } from './services/DocumentoService';
import { BDDocumentClient } from './clients/BDDocumentClient';
import { FSDocumentClient } from './clients/FSDocumentClient';

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
          url: process.env.GRPC_AUTH_URL,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'DOCUMENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'documentos',
          protoPath: join(process.cwd(), 'src/proto/documento.proto'),
          url: process.env.GRPC_AUTH_URL,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'STORAGE_PACKAGE', // Nombre para inyectar este cliente
        transport: Transport.GRPC,
        options: {
          package: 'storage',
          protoPath: join(process.cwd(), 'src/proto/storage.proto'), // Asegúrate de copiar el .proto aquí también
          url: 'localhost:50051', // Puerto de tu microservicio de Storage
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'usuario',
          protoPath: join(process.cwd(), 'src/proto/user.proto'),
          url: process.env.GRPC_AUTH_URL,
        },
      },
    ]),
  ],
  controllers: [UserController, AuthController, CarpetaController, DocumentController],
  providers: [
    {
      provide: 'ICarpetaCacheRepository',
      useClass: CarpetaCacheRepository,
    },
    AuthClient,
    CarpetaClient,
    BDDocumentClient,
    FSDocumentClient,
    {
      provide: 'IDocumentosService', // El nombre exacto que pusiste en el @Inject(...)
      useClass: DocumentoService,   // La clase real que ejecutará el código
    },
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