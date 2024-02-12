import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule , {
    logger: ['error', 'warn'],
});
  app.enableCors();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()} 🚀`);
}
bootstrap();
