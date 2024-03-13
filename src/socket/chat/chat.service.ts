import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chats } from "./entity/chat.entity";
import { Repository } from "typeorm";
import { CreateChatDto } from "./dto/create-chat.dto";
import { Socket } from "socket.io";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chats) private readonly chatRepository: Repository<Chats>
    ) {}

    async createChat(message: string ,client: Socket) {
        const roomId = client.handshake.query.roomId as string;
        const chat = this.chatRepository.create({ roomId, message });
        await this.chatRepository.save(chat);
    }

}