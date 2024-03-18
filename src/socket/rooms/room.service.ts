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
        return this.roomRepository.findOne({ where: { senderId, receiverId } });
    }

    async createRoom(senderId: number, receiverId: number, client: Socket): Promise<Rooms | string> {

        const existingRoom = await this.findRoom(senderId, receiverId);

        if (existingRoom) {
            client.emit('createChat', existingRoom.id);
            return existingRoom;
        }
        const room = this.roomRepository.create({ senderId, receiverId });
        await this.roomRepository.save(room);
        client.emit('createChat', room.id);
        return room;
    }

    async verifyJoinUser(client: Socket , roomId: string) {
        const user = client.data.userId || null;
        const room = await this.roomRepository.findOne({ where: { id : roomId } });
        if(user !== room.senderId && user !== room.receiverId) {
            return client.emit('joined', 'User not authorized to join this room');
            // return this.socketService.disconnectSocket(user);
        }
        return true;
    }
}
