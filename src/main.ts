import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { GqlHttpExceptionFilter } from './utils/graphql-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new GqlHttpExceptionFilter());
  app.useGlobalPipes( new ValidationPipe( {transform: true}) );
  const config = new DocumentBuilder()
    .setTitle('NestJS Application')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addTag('API Prectise')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()} 🚀`);
}
bootstrap();

