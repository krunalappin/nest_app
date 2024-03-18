import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chats } from "./entity/chat.entity";
import { In, Repository } from "typeorm";
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
                saveChat.isRead = true;
                saveChat.readAt = new Date();
                await this.chatRepository.save(saveChat);
            }
        } catch (error) {
            chat.status = 'failed';
        }
        await this.chatRepository.save(chat);
    }

    //when touser join room.
    async markChatAsRead(unreadMessageIds: string[]) {
        await this.chatRepository.update(
            { id : In(unreadMessageIds) },
            { isRead: true, readAt: new Date(), status: 'read' }
        );
        // await this.chatRepository.update(
        //     { roomId, toUser: user, status: 'delivered' },
        //     { isRead: true, readAt: new Date(), status: 'read' }
        // );
    }

    //Mark as read updated data
    async getUpdatedMessages(unreadMessageIds: string[]) {
        return await this.chatRepository.findByIds(unreadMessageIds);
    }

    //when touser connect socket
    async updateChatStatus(userId: number) {
        await this.chatRepository.update(
            { toUser: userId, status: 'sent' },
            { status: 'delivered' }
        );
    }

    async deleteChatMessage(id: string, client: Socket) {
        const deletedMessage = await this.chatRepository.softDelete({ id });
        const deleted = deletedMessage ? await this.getChatById(id) : null;
        return deleted;
    }

    async getChatById(id: string): Promise<Chats | null> {
        const chat = await this.chatRepository.findOne({ where: { id }, withDeleted: true });
        return chat;
    }

    async getMessages(roomId: string) {
        const chat = await this.chatRepository.find({ where: { roomId }, take: 20 });
        return chat;
    }

    async findUnreadMessages(roomId: string, client: Socket) {
        const chat = await this.chatRepository.find({ where: { roomId, toUser: client.data.userId, isRead: false }, select: ['id']});
        const unreadData = chat.map(chat => chat.id);
        return unreadData;
    }

}