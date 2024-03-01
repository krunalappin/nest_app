import { BadRequestException, Injectable, NotFoundException, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { QueryFailedError, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashPassword } from "../utils/password.util";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
       
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const hashedPassword = await hashPassword(createUserDto.password);
            const user = new User({...createUserDto , password : hashedPassword});
            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    async getAllUsers(): Promise<any> {
        const users = await this.userRepository.find();
        if (users.length === 0) {
            return 'User Data Is Empty'
        }
        return users;
    }

    async deleteUser(id: number): Promise<string> {
        try {
            const result = await this.userRepository.delete(id);
            if (result.affected === 0) {
                throw new BadRequestException('User not found');
            }
            return `User Successfully Deleted with id ${id}`;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    async updateUser(id: number, updateUserDto: CreateUserDto): Promise<User> {
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new BadRequestException('User not found');
            }
            const updatedUser = Object.assign(user, updateUserDto);
            return await this.userRepository.save(updatedUser);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOneById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return (user);
    }

    async findUserByPhoneNumber(phoneNumber: string) {
        return this.userRepository.findOneBy({ phoneNumber });
    }

    async findOneBy(email: string) {
        return this.userRepository.findOneBy({ email });
    }

}