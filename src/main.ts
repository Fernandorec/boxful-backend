import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Servidor corriendo en http://localhost:3001`);
}

bootstrap();