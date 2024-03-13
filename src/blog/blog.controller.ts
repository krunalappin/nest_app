import { Controller, Get, Post, Body, Param, Delete ,ValidationPipe, UsePipes, HttpException, HttpStatus, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Blog } from './entities/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  async create(@Body() createBlogDto: CreateBlogDto) {
    const data = await this.blogService.create(createBlogDto);
    return data;
  }

  @Get()
  async findAll() {
    const data = await this.blogService.getAllBlog();
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: number ) : Promise<Blog> {
    const data = this.blogService.findOne(id);
    return data;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({transform: true}))
  update(@Param('id' ,ParseIntPipe) id: number, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const data = this.blogService.remove(id);
    return data;
  }
}
