import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  // Le pasamos el FastifyAdapter a NestJS
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  // Habilitar CORS
  app.enableCors(); 
  
  // En Fastify, es recomendable especificar '0.0.0.0' para que escuche en todas las interfaces,
  // especialmente útil si luego lo metes en un contenedor Docker.
  await app.listen(3000, '0.0.0.0');
  console.log(`Aplicación corriendo con Fastify en: http://localhost:3000`);
}
bootstrap();