import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rooms } from "./entity/room.entity";
import { Repository } from "typeorm";
import { Socket } from "socket.io";
import { SocketService } from "../socket.service";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Rooms) private readonly roomRepository: Repository<Rooms>,
        @Inject(forwardRef(() => SocketService))
        private readonly socketService: SocketService
    ) { }

    async findRoom(senderId: number, receiverId: number): Promise<Rooms | undefined> {
        return this.roomRepository.findOne({ 
            where: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });
    }

    async createRoom(senderId: number, receiverId: number, client: Socket) {

        const existingRoom = await this.findRoom(senderId, receiverId);

        if (existingRoom) {
            client.emit('createChat', existingRoom.id);
            return existingRoom;
        }
        const room = this.roomRepository.create({ senderId, receiverId });
        await this.roomRepository.save(room);
        client.emit('createChat', room);
        client.to(String(senderId)).emit('createChat', room);
        client.to(String(receiverId)).emit('createChat', room);
        return room;
    }

    async verifyJoinUser(client: Socket, roomId: string) {
        const user = client.data.userId || null;
        const room = await this.roomRepository.findOne({ where: { id: roomId } });
        if (user !== room.senderId && user !== room.receiverId) {
            return client.emit('joined', 'User not authorized to join this room');
            // return this.socketService.disconnectSocket(user);
        }
        return true;
    }

    async blockUser(userId: number, roomId: string, client: Socket) {
        const reqUser = client.data.userId;

        const room = await this.roomRepository.findOne({ where: { id: roomId } });
        if (room.senderId !== userId && room.receiverId !== userId) {
            client.emit('error', { message: 'User not authorized to block this user' });
            return null;
        }

        if (reqUser === userId) {
            client.emit('error', { message: 'User cannot block himself' });
            return null;
        }
        if (room.blockUserIds.includes(userId)) {
            client.emit('error', { message: 'User already blocked' });
            return null;
        }
        room.blockUserIds.push(userId);
        const blockedUser = await this.roomRepository.save(room);
        client.emit('blockUser', blockedUser);
        client.to(roomId).emit('blockUser', { message: `User ${userId} has been blocked` });

    }

    async unBlockUser(userId: number, roomId: string, client: Socket) {
        const room = await this.roomRepository.findOne({ where: { id: roomId } });
        const index = room.blockUserIds.indexOf(userId);
        if (index !== -1) {
            room.blockUserIds.splice(index, 1);
        }
        // Save the updated room
        const unblockedUser = await this.roomRepository.save(room);
        client.emit('unBlockUser', unblockedUser);
        client.to(roomId).emit('unBlockUser', { message: `User ${userId} has been unblocked` });
    }

    async checkBlockStatus(roomId: string, userId: number, client: Socket) {
        const room = await this.roomRepository.findOne({ where: { id: roomId } });
        if (room.blockUserIds.includes(userId)) {
            return true;
        }

        return false;
    }

    async getRoom(roomId: string) {
        return await this.roomRepository.findOne({ where: { id: roomId } });
    }
}
