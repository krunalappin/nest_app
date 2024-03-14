import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rooms } from "./entity/room.entity";
import { Repository } from "typeorm";
import { User } from "src/user/entity/user.entity";
import { Socket } from "socket.io";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Rooms) private readonly roomRepository: Repository<Rooms>,
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async findRoom(senderId: number, receiverId: number): Promise<Rooms | undefined> {
        return this.roomRepository.findOne({ where: { senderId, receiverId } });
    }

    async createRoom(senderId: number, receiverId: number, client: Socket): Promise<Rooms | string> {

        const existingRoom = await this.findRoom(senderId, receiverId);

        if (existingRoom) {
            client.emit('createChat',existingRoom.id);
            return existingRoom;
        }
        const room = this.roomRepository.create({ senderId, receiverId });
        await this.roomRepository.save(room);
        client.emit('createChat', room.id);
        return room;
    }


}
