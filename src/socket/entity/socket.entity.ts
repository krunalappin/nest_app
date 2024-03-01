import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sockets {
    @PrimaryGeneratedColumn('uuid')
    id : string

    @ManyToOne(() => User, (user) => user.socket)
    user: User

    @Column()
    socketId: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date
    
}