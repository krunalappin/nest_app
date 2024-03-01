import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sockets } from './entity/socket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';


@Injectable()
export class SocketService {

    constructor(
        @InjectRepository(Sockets) private readonly socketRepository: Repository<Sockets>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async create(client: Socket) {
        try {
            const token = client.handshake.headers.authorization;
            if (!token) {
                throw new Error('Authorization token not provided');
            }
            const decodedToken = await this.jwtService.verifyAsync(
                token,
                { secret: jwtConstants.secret }
            )
            const userId = decodedToken.sub;

            let sockets = await this.socketRepository.findOne({ where: { userId } });
                
                
            if (sockets) {
                sockets.socketId = client.id;
                sockets.status = 'online';
                await this.socketRepository.save(sockets);
                console.log(`User ${userId} connected with socket id ${client.id}`);
            } else {
                await this.socketRepository.save({ userId, socketId: client.id });
                console.log(`User ${userId} connected with socket id ${client.id}`);
            }
        } catch (error) {
            console.error('Authentication error:', error.message);
            client.disconnect(true);
        }

    }

    async disconnectSocket(client: Socket) {

        const existingSocket = await this.socketRepository.findOne({ where: { socketId: client.id } });
        if (existingSocket) {
            existingSocket.status = 'offline';
            existingSocket.updatedAt = new Date();
            await this.socketRepository.save(existingSocket);
        }
    }

}
