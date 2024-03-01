import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chats } from "./entity/chat.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chats) private readonly chatRepository: Repository<Chats>
    ) {}

    
}