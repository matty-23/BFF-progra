import { Module } from '@nestjs/common';
import { UserController } from './controllers/UserController';
import UserService from './services/UserService';
import UserProfile from './clients/UserProfile';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      // Cuando un controlador pida 'IUserService', entrégale una instancia de UserService
      provide: 'IUserService',
      useClass: UserService, 
    },
    {
      // Cuando UserService pida 'IUserClient', entrégale una instancia de UserProfile
      provide: 'IUserClient',
      useClass: UserProfile, 
    }
  ],
})
export class AppModule {}