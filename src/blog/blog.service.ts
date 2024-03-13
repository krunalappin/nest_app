import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class BlogService {

  constructor(
    @InjectRepository(Blog) private blogRepository : Repository<Blog>,
    @InjectRepository(User) private userRepository : Repository<User>
  ){}

  async create(createBlogDto: CreateBlogDto) {
    const {title, description,user} = createBlogDto;
    if(!user){
      throw new HttpException('Please provide user', HttpStatus.BAD_REQUEST);
    }
    const data = await this.userRepository.findOneBy({id : user.id});
    if(!data){
      throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    }
    const blog = new Blog();
    blog.title = title;
    blog.description = description;
    blog.user = user;
    return this.blogRepository.save(blog);
    
  }

  async getAllBlog(): Promise<any> {
    return await this.blogRepository.find()
  }

  findOne(id: number) : Promise<Blog> {
    const blog = this.blogRepository.findOneBy({id})
    if(!blog){
      throw new NotFoundException(`Blog Not found from this id ${id}`);
    }
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({id});
    if(!blog){
      throw new HttpException(`Blog Not found from this id ${id}`, HttpStatus.NOT_FOUND);
    }
    const updatedBlog = Object.assign(blog, updateBlogDto);
    return this.blogRepository.save(updatedBlog);
  }

  async remove(id: number) : Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({id});
    if(!blog){
      throw new HttpException('Blog Not found', HttpStatus.NOT_FOUND);
    }
    return this.blogRepository.remove(blog);
  }
}
