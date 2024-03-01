import { Controller, Get, Post, Body, Patch, Param, Delete ,ValidationPipe, UsePipes, BadRequestException, UseFilters, HttpException, HttpStatus, Put, ParseIntPipe, UseGuards, NotFoundException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Blog } from './entities/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  // @UseFilters(new HttpExceptionFilter())
  async create(@Body() createBlogDto: CreateBlogDto) {
    const data = await this.blogService.create(createBlogDto);
    return data;
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    const data = await this.blogService.findAll();
    if(!data){
      throw new HttpException('Blog Not found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number ) : Promise<Blog> {
    const data = this.blogService.findOne(id);
    return data;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({transform: true}))
  update(@Param('id' ,ParseIntPipe) id: number, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const data = this.blogService.remove(id);
    return data;
  }
}
