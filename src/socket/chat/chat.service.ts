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
    ) { }

    async createChat(createChatDto: CreateChatDto, client: Socket, status: 'sent' | 'delivered') {
        const fromUser = client.data.userId
        const chat = this.chatRepository.create({ ...createChatDto, fromUser, status, sentAt: new Date() });

        try {
            const saveChat = await this.chatRepository.save(chat);

            if (status === 'delivered') {
                saveChat.read = true;
                saveChat.readAt = new Date();
                await this.chatRepository.save(saveChat);
            }
        } catch (error) {
            chat.status = 'failed';
        }
        await this.chatRepository.save(chat);
    }

    //when touser join room.
    async markChatAsRead(user: number, roomId: string) {
        await this.chatRepository.update(
            { roomId, toUser: user, status:'delivered' }, 
            { read: true, readAt: new Date()}
        );
    }

    //when touser connect socket
    async updateChatStatus(userId: number) {
        await this.chatRepository.update(
            { toUser: userId, status: 'sent' }, 
            { status: 'delivered' }
        );
    }

    async deleteChatMessage(chatId: number) {
        await this.chatRepository.delete(chatId);
    }

    async getChatsByRoomId(roomId) {
        return await this.chatRepository.find(roomId);
    }

}