import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { User } from 'src/user/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    AuthModule,
    SessionModule,
    TypeOrmModule.forFeature([Blog]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
