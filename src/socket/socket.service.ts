import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sockets } from './entity/socket.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { RoomInterface } from './dto/roomInterface.dto';
import { CreateChatDto } from './chat/dto/create-chat.dto';
import { ChatService } from './chat/chat.service';
import { RoomService } from './rooms/room.service';

const socketRoomMap: { [userId: number]: string } = {};
const activeRooms: RoomInterface[] = [];

@Injectable()
export class SocketService {

    constructor(
        @InjectRepository(Sockets) private readonly socketRepository: Repository<Sockets>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly authService: AuthService,
        private readonly chatService: ChatService,
        private readonly roomService: RoomService
    ) { }

    async createSocket(client: Socket) {
        try {
            const token = client.handshake.headers.authorization;
            const user = await this.authService.verifyToken(token);
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
            await this.chatService.updateChatStatus(userId);

            client.emit('connected', `Welcome to the chat! ${client.id}`);

        } catch (error) {
            client.emit('error', error.message);
            this.handleSocketStatus(client);
        }

    }

    async disconnectSocket(client: Socket) {
        const user = client.data.userId;
        this.handleLeaveRoom(user);
        this.handleSocketStatus(client);
        return
    }

    async handleSocketStatus(client: Socket) {
        const existingSocket = await this.socketRepository.findOne({ where: { socketId: client.id } });
        if (existingSocket) {
            existingSocket.status = 'offline';
            existingSocket.updatedAt = new Date();
            await this.socketRepository.save(existingSocket);
        }
        client.emit('disconnected', `Goodbye! ${client.id}`);
        client.disconnect(true);
    }

    async handleJoinRoom(client: Socket, { roomId }: { roomId: string }) {

        const room = activeRooms.find(room => room.roomId === roomId);
        if (room && room.userId.length >= 2) {
            client.emit('error', 'This room is already full.');
            return;
        }

        const checkRoomUser = await this.roomService.verifyJoinUser(client, roomId);
        if (!checkRoomUser) {
            return;
        }
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
        // await this.chatService.markChatAsRead(user, roomId);
        client.join(roomId);
        client.emit('joined', `On joined ::: ${roomId}`);
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

        // If User Not Join In Room
        if (!room || !room.userId.includes(user)) {
            client.emit('message', {message , userId : user});
            return;
        }

        //If Second User Not Join With Room
        if (room.userId.length === 1) {           
            this.chatService.createChat(createChatDto, client, 'sent');
            client.emit('message', {message , userId : user});
            return
        }

        client.to(roomId).emit('message', { message, userId: user });
        return this.chatService.createChat(createChatDto, client, 'delivered');
    }

    async handleUnReadMessages({ roomId }: { roomId: string }, client: Socket) {
        const chat = await this.chatService.findUnreadMessages(roomId , client);
        client.emit('unReadMessages', chat);
    }

    async handleDeleteMessage({id}: { id: string} , client: Socket) {
        const deletedMessage = await this.chatService.deleteChatMessage(id , client);
        client.emit('deleteMessages', deletedMessage);
    }

    async handleGetMessages({ roomId }: { roomId: string } , client: Socket) {

        const checkUser = await this.handleCheckUserInRoom({ roomId } , client);
        if (!checkUser) {
            return;
        }
        const chat = await this.chatService.getMessages(roomId);
        client.emit('getAllMessages', { chat });
    }

    async handleCheckUserInRoom({ roomId }: { roomId: string } , client: Socket) {
        const user = Number(client.data.userId);
        const room = activeRooms.find(room => room.roomId === roomId);
        if (!room || !room.userId.includes(user)) {
            client.emit('error', {message: 'User not join in this room'});
            return;
        }
        return true
    }

    async handleMakeAsRead(unreadMessageIds: string[], client: Socket) {
        
        if (!unreadMessageIds || !unreadMessageIds.length) {
            return; // No unread message IDs provided
          }
        await this.chatService.markChatAsRead(unreadMessageIds);

        const chat = await this.chatService.getUpdatedMessages(unreadMessageIds);
        client.emit('makeAsRead', chat);
        client.broadcast.emit('makeAsRead', chat);
    }
}
