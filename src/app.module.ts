import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { SessionModule } from './session/session.module';
import { TableModule } from './dropTable/table.module';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { LoggerHelper } from './logger/logger.service';
import { SocketModule } from './socket/socket.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { AuthGuard } from './auth/auth.guard';
import { SocketAuthGuard } from './auth/auth.socket.guard';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      path: '/api/graphql',
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
    }),
    SocketModule,
    OrderModule,
    ProductModule,
    CategoryModule,
    TableModule,
    UserModule,
    BlogModule,
    AuthModule,
    SessionModule,
  ],
  providers: [
    AuthController, 
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    LoggerHelper,
    
  ],
  
})
export class AppModule {}

