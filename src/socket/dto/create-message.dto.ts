import { User } from "src/user/entity/user.entity";

export class CreateMessageDto {
    user: User;
    socketId: string;
}