import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { SocketAuthGuard } from './auth/auth.socket.guard';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.enableCors();
  // app.useWebSocketAdapter(new SocketAuthGuard(app));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('NestJS Application')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addTag('API Prectise')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const logo = fs.readFileSync('nest-js.txt', 'utf-8');
  await app.listen(3000);
  console.log(logo);
  console.log(`Application is running on: ${await app.getUrl()} 🚀`);
}
bootstrap();

