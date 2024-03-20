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
        const { roomId, message, toUser } = createChatDto;
        const user = Number(client.data.userId);
        const room = activeRooms.find(room => room.roomId === roomId);

        const checkReceiverBlock = await this.roomService.checkBlockStatus(roomId, toUser, client);
        if (checkReceiverBlock) {
            return client.emit('error', { message: `User ${toUser} is blocked` });
        }

        const senderBlockedByReceiver = await this.roomService.checkBlockStatus(roomId, user, client);
        if (senderBlockedByReceiver) {
            this.chatService.createChat(createChatDto, client, 'block');
            client.emit('message', { message, userId: user });
            return;
        }

        // If User Not Join In Room
        if (!room || !room.userId.includes(user)) {
            client.emit('message', { message, userId: user });
            return;
        }

        //If Second User Not Join With Room
        if (room.userId.length === 1) {
            this.chatService.createChat(createChatDto, client, 'sent');
            client.emit('message', { message, userId: user });
            return
        }

        await this.chatService.createChat(createChatDto, client, 'delivered');
        client.to(roomId).emit('message', { message, userId: user });
        return;
    }

    async handleUnReadMessages({ roomId }: { roomId: string }, client: Socket) {
        const chat = await this.chatService.findUnreadMessages(roomId, client);
        client.emit('unReadMessages', chat);
    }

    async handleGetMessages({ roomId }: { roomId: string }, client: Socket) {

        const checkUser = await this.handleCheckUserInRoom({ roomId }, client);
        if (!checkUser) {
            return;
        }
        const chat = await this.chatService.getMessages(roomId, client);
        console.log(':: ========= :: > Get All Messages < :: ========= :: ', chat.length);
        client.emit('getAllMessages', chat);
    }

    async handleCheckUserInRoom({ roomId }: { roomId: string }, client: Socket) {
        const user = Number(client.data.userId);
        const room = activeRooms.find(room => room.roomId === roomId);
        if (!room || !room.userId.includes(user)) {
            client.emit('error', { message: 'User not join in this room' });
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

    async handleDeleteMessage(chatIds: string[], client: Socket) {

        const deletedMessage = await this.chatService.deleteChatMessage(chatIds, client);
        client.emit('deleteMessages', deletedMessage);
    }

    async handleDeleteMessageForEveryone(chatIds: string[], client: Socket) {
        const deletedMessage = await this.chatService.deleteChatMessageForEveryone(chatIds, client);
        client.emit('deleteMessages', deletedMessage);
    }

    async handleClearChat({ roomId }: { roomId: string }, client: Socket) {
        const checkUserInRoom = await this.handleCheckUserInRoom({ roomId }, client);
        if (!checkUserInRoom) {
            return;
        }
        const chat = await this.chatService.clearChat(roomId, client);
        client.emit('clearChat', chat);
    }

    async handleEditMessage(chatId: string, message: string, client: Socket) {
        const chat = await this.chatService.editMessage(chatId, message, client);
        client.emit('editMessage', chat);
        client.broadcast.emit('editMessage', chat);
    }

    async handleBlockUser(userId: number, roomId: string, client: Socket) {
        const checkUserInRoom = await this.handleCheckUserInRoom({ roomId }, client);
        if (!checkUserInRoom) {
            return;
        }
        return await this.roomService.blockUser(userId, roomId, client);

    }

    async handleUnBlockUser(userId: number, roomId: string, client: Socket) {
        const checkUserInRoom = await this.handleCheckUserInRoom({ roomId }, client);
        if (!checkUserInRoom) {
            return;
        }
        return await this.roomService.unBlockUser(userId, roomId, client);
    }
}
