import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sockets } from './entity/socket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { RoomInterface } from './dto/roomInterface.dto';
import { CreateChatDto } from './chat/dto/create-chat.dto';
import { ChatService } from './chat/chat.service';

const socketRoomMap: { [userId: number]: string } = {};
const activeRooms: RoomInterface[] = [];

@Injectable()
export class SocketService {

    constructor(
        @InjectRepository(Sockets) private readonly socketRepository: Repository<Sockets>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly authService: AuthService,
        private readonly chatService: ChatService
    ) { }

    async create(client: Socket) {
        try {
            const token = client.handshake.headers.authorization;
            const user = await this.authService.verifyToken(token);
            if (!user) {
                client.disconnect();
            }
            const userId = user.sub;
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

            client.emit('connected', `Welcome to the chat! ${client.id}`);
            
        } catch (error) {
            console.error('Authentication error:', error.message);
            client.disconnect(true);
        }

    }

    async disconnectSocket(client: Socket) {
        const user = client.data.userId;
        this.handleLeaveRoom(user);

        const existingSocket = await this.socketRepository.findOne({ where: { socketId: client.id } });
        if (existingSocket) {
            existingSocket.status = 'offline';
            existingSocket.updatedAt = new Date();
            await this.socketRepository.save(existingSocket);
        }

        client.emit('disconnected', `Goodbye! ${client.id}`);
    }

    async handleJoinRoom(client: Socket, { roomId }: { roomId: string }) {
        const user = client.data.userId;
        const roomIndex = activeRooms.findIndex(room => room.roomId === roomId);
        if (roomIndex !== -1) {
            activeRooms[roomIndex].userId.push(user);
        } else {
            const newRoom: RoomInterface = {
                roomId,
                userId: [user]
            };
            activeRooms.push(newRoom);
        }
        socketRoomMap[user] = roomId;

        client.join(roomId);
        client.emit('joined', `You joined ${roomId}`);
        client.to(roomId).emit('joined', `${client.id} joined ${roomId}`);

    }

    async handleLeaveRoom(user: number) {
        const roomId = socketRoomMap[user];
        if (roomId) {
            const roomIndex = activeRooms.findIndex(room => room.roomId === roomId);
            if (roomIndex !== -1) {
                const userIndex = activeRooms[roomIndex].userId.indexOf(user);
                if (userIndex !== -1) {
                    activeRooms[roomIndex].userId.splice(userIndex, 1);
                    if (activeRooms[roomIndex].userId.length === 0) {
                        activeRooms.splice(roomIndex, 1);
                    }
                }
                delete socketRoomMap[user];
            }
        }
    }

    async handleMessages(createChatDto: CreateChatDto, client: Socket) {
        const { roomId, message } = createChatDto;
        const user = Number(client.data.userId);
        const room = activeRooms.find(room => room.roomId === roomId);
        if (!room || socketRoomMap[user.toString()] !== roomId) {
            console.log(':: ========= :: > Room < :: ========= :: ', socketRoomMap[user.toString()] !== roomId);
            return client.emit('message', message + ' ' + client.id);
        }
        if (room.userId.length === 1) {
            return client.emit('message', message + ' ' + client.id);
        }
        client.to(roomId).emit('message', message + ' ' + client.id);
        return this.chatService.createChat(createChatDto, client);
    }
}
