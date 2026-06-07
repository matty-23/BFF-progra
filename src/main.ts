import 'dotenv/config'; 
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { connectDB } from './schemas/conexion';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function bootstrap() {
  try {
    await connectDB();

    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
    );
    
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    console.log(`BFF is running on port ${PORT} (HTTP only)`);

  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();