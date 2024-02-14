import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { FileModule } from './fileUpload/file.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { SessionModule } from './session/session.module';
import { TableModule } from './dropTable/table.module';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'nest_0602',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ProductModule,
    CategoryModule,
    TableModule,
    UserModule,
    BlogModule,
    AuthModule,
    SessionModule, 
  ],
  providers: [AuthController],
  
})
export class AppModule {}

