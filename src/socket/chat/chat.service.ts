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

    async createChat(createChatDto : CreateChatDto, client: Socket) {
        const fromUser = client.data.userId
        const chat = this.chatRepository.create({ ...createChatDto, fromUser });
        await this.chatRepository.save(chat);
    }

}