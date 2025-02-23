import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Share exp')
    .setDescription('')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: 'http://localhost:3000', // Дозволяємо запити з Next.js
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Які методи дозволені
    allowedHeaders: 'Content-Type,Authorization', // Дозволені заголовки
    credentials: true, // Якщо треба передавати кукі
  });

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
