import 'dotenv/config'; 
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { connectDB } from './database/schemas/conexion';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie'; 
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function bootstrap() {
  try {
    await connectDB();

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
    );
    await app.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET, 
    });
    
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, 
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    console.log(`BFF is running on port ${PORT} (HTTP only)`);

  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();