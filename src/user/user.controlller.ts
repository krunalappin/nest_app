import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entity/user.entity";
import { Response } from "express";
import { Public } from "src/constants/message-constants";
import { BlockUserDto } from "./dto/create-block-user.dto";

@Public()
@Controller('/users')
export class UserController {
   constructor(private readonly userService:UserService){}

   
   @Post()
   @UsePipes(new ValidationPipe({transform:true}))
   async createUser(@Body() createUserDto : CreateUserDto) : Promise<User>{
       const user = await this.userService.createUser(createUserDto);
       return user;
   }

   @Post('/blockUser')
   async blockUser(@Body() blockUserDto : BlockUserDto): Promise<User>{
       const user = await this.userService.blockUser(blockUserDto);
       return user;
   }

   @Get()
   async getAllUsers() : Promise<User[]>{
       const users = await this.userService.getAllUsers();
       return users;
   }

   @Delete(':id')
   async deleteUser(@Param('id') id : number) : Promise<string>{
       const data = await this.userService.deleteUser(id);
       return data;
   }

   @Put(':id')
   async updateUser(@Param('id') id : number, @Body() updateUserDto : CreateUserDto) : Promise<User>{
       const user = await this.userService.updateUser(id,updateUserDto);
       return user;
   }

   @Get(':id')
   async getUserById(@Param('id') id : number) : Promise<User>{
       const user = await this.userService.getUserById(id);
       return user;
   }

 @Post('/login')
 async loginUser(@Body() loginUserDto: CreateUserDto, @Res() response: Response) {
    try {
      const user = await this.userService.findUserByPhoneNumber(loginUserDto.phoneNumber);

      if (!user) {
        throw new Error('User not found');
      }
      const userlog = {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
      const otp = Math.floor(100000 + Math.random() * 900000);

      response.cookie('otp', otp.toString(), { httpOnly: true });

      return response.status(200).json({ userlog, otp });
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserByEmail(@Body() body : CreateUserDto): Promise<User> {
    return this.userService.findOneBy(body.email);
  }

}


  
  
