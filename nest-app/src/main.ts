import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:3000/posts',
    credentials: true,
  });
}

bootstrap();
