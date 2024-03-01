import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Chats } from "./entity/chat.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chats]),
    ],
    controllers: [],
    providers: [ChatService],
    exports: [ChatService]
})
export class ChatModule {}