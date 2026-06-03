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

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), 'src/proto/auth.proto'), 
          url: 'localhost:50051', 
        },
      },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [
    AuthClient,
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
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('*');
  }
}