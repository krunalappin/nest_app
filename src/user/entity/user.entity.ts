import { Blog } from "src/blog/entities/blog.entity";
import { Orders } from "src/order/entity/order.entity";
import { UserSession } from "src/session/session.entity";
import { Sockets } from "src/socket/entity/socket.entity";
import { Rooms } from "src/socket/rooms/entity/room.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true, unique: true })
    phoneNumber: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastDeactivatedAt: Date;

    @OneToMany(() => Blog, (blog) => blog.user)
    blog: Blog[];

    @OneToMany(() => UserSession, (session) => session.user)
    session: UserSession[];

    @OneToMany(() => Orders, (order) => order.user)
    order: Orders[];

    @OneToMany(() => Sockets, (socket) => socket.user)
    socket: Sockets[];

    @OneToMany(() => Rooms, (room) => room.sender)
    sender: Rooms[];

    @OneToMany(() => Rooms, (room) => room.receiver)
    receiver: Rooms[];

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

}