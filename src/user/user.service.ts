import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { hashPassword } from "../utils/password.util";
import { BlockUserDto } from "./dto/create-block-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entity/user.entity";
import { SocketService } from "src/socket/socket.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @Inject(forwardRef(() => SocketService))
        private readonly socketService: SocketService
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const hashedPassword = await hashPassword(createUserDto.password);
            const user = new User({ ...createUserDto, password: hashedPassword });
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

    async updatelastDeactivatedAt(id: number, lastDeactivatedAt: Date | null) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.lastDeactivatedAt = lastDeactivatedAt;
        return await this.userRepository.save(user);

    }

    async blockUser(blockUserDto: BlockUserDto): Promise<User> {
        const { userId, blockDays } = blockUserDto;
        const currentDate = new Date();
        const blockDate = new Date(currentDate.getTime() + (blockDays * 24 * 60 * 60 * 1000));
        const user = await this.userRepository.update({ id: userId }, { lastDeactivatedAt: blockDate });
        // this.socketService.handleDisconnect(userId);
        return await this.userRepository.findOneBy({ id: userId });
    }
}
