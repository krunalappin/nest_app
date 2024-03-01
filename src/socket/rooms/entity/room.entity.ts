import { Chats } from "src/socket/chat/entity/chat.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rooms {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, (user) => user.sender)
    sender: User

    @Column()
    senderId: number

    @ManyToOne(() => User, (user) => user.receiver)
    receiver: User
    
    @Column()
    receiverId: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @OneToMany(() => Chats, (chat) => chat.room)
    chat: Chats
}