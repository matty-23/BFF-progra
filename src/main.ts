import 'dotenv/config'; 
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { connectDB } from './schemas/conexion';
import dns from 'node:dns';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
dns.setServers(['8.8.8.8', '8.8.4.4']);
async function bootstrap() {
  try {
    await connectDB();

    const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
    app.enableCors({
  origin: true, // o 'http://localhost:5173'
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: ['auth', 'carpetas'], 
        // Declaramos las rutas a ambos archivos .proto
        protoPath: [
          join(process.cwd(), 'src/proto/auth.proto'),
          join(process.cwd(), 'src/proto/carpeta.proto')
        ],
        url: '0.0.0.0:50051', 
      },
    });

    await app.startAllMicroservices(); 
    
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    console.log(`Backend is running on port ${PORT}`);

  } catch (error) {

    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}


bootstrap();