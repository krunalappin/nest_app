import { Rooms } from "src/socket/rooms/entity/room.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chats {
   @PrimaryGeneratedColumn('uuid')
   id: string

   @ManyToOne(() => Rooms, (room) => room.id)
   room: Rooms

   @Column()
   roomId: string

   @Column()
   messages: string

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   createdAt: Date
}