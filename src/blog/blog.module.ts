import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    
    TypeOrmModule.forFeature([Blog]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
