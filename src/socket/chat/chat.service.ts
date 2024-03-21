import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chats } from "./entity/chat.entity";
import { Brackets, In, IsNull, Not, Repository } from "typeorm";
import { CreateChatDto } from "./dto/create-chat.dto";
import { Socket } from "socket.io";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chats) private readonly chatRepository: Repository<Chats>
    ) { }

    async createChat(createChatDto: CreateChatDto, client: Socket, status: 'sent' | 'delivered' | 'block') {
        const fromUser = client.data.userId
        const chat = this.chatRepository.create({ ...createChatDto, fromUser, status, sentAt: new Date() });
        const message = await this.chatRepository.save(chat);
        return message;
    }

    //when touser join room.
    async markChatAsRead(unreadMessageIds: string[]) {
        await this.chatRepository.update(
            { id: In(unreadMessageIds) },
            { isRead: true, readAt: new Date(), status: 'read' }
        );
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

    async deleteChatMessage(chatIds: string[], client: Socket) {

        const user = client.data.userId
        await chatIds.map(async (chatId) => {
            const chat = await this.chatRepository.findOne({ where: { id: chatId } });
            if (chat) {
                if (chat.fromUser === user) {
                    chat.deletedAtUser1 = new Date();
                } else if (chat.toUser === user) {
                    chat.deletedAtUser2 = new Date();
                }
                await this.chatRepository.save(chat);
            }
        });

        const chats = await this.getChatById(chatIds);
        return chats;
    }

    async deleteChatMessageForEveryone(chatIds: string[], client: Socket) {

        const user = client.data.userId

        await chatIds.map(async (chatId) => {
            const chat = await this.chatRepository.findOne({ where: { id: chatId } });
            const checkTime = new Date(Date.now() - 15 * 60 * 1000);
            if (chat) {

                if (chat.toUser === user && chat.sentAt < checkTime) {
                    return;
                } else {
                    chat.deletedAtUser1 = new Date();
                    chat.deletedAtUser2 = new Date();
                    await this.chatRepository.save(chat);
                }
            }
        })
        const chats = await this.getChatById(chatIds);
        return chats;
    }

    async getChatById(chatIds: string[]): Promise<Chats[]> {
        const chat = await this.chatRepository.find({ where: { id: In(chatIds) }, withDeleted: true });
        return chat;
    }

    async getMessages(roomId: string, client: Socket) {
        const user = client.data.userId

        const chat = await this.chatRepository.find({
            where: [
                { roomId: roomId, fromUser: user, deletedAtUser1: IsNull() },
                { roomId: roomId, toUser: user, status: Not('block'), deletedAtUser2: IsNull() }
            ],
            order: {
                sentAt: 'ASC'
            },
            take: 50
        });
        return chat;

    }

    async findUnreadMessages(roomId: string, client: Socket) {
        const chat = await this.chatRepository.find({ where: { roomId, toUser: client.data.userId, isRead: false }, select: ['id'] });
        const unreadData = chat.map(chat => chat.id);
        return unreadData;
    }

    async clearChat(roomId: string, client: Socket) {
        const user = client.data.userId
        const chat = await this.chatRepository.find({ where: { roomId } });
        if (chat) {
            chat.map(async (chat) => {
                if (chat.fromUser === user) {
                    chat.deletedAtUser1 = new Date();
                } else if (chat.toUser === user) {
                    chat.deletedAtUser2 = new Date();
                }
                await this.chatRepository.save(chat);
            })
        }

        return chat;
    }

    async editMessage(chatId: string, message: string, client: Socket) {
        const user = client.data.userId
        const chat = await this.chatRepository.findOne({ where: { id: chatId } });
        const checkTime = new Date(Date.now() - 15 * 60 * 1000);
        if (chat) {
            if (chat.sentAt < checkTime || chat.fromUser !== user) {
                return null;
            }
            await this.chatRepository.update({ id: chatId }, { message });
            return chat;
        }
    }

}