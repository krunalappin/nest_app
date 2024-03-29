import { Rooms } from "src/socket/rooms/entity/room.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chats {
   @PrimaryGeneratedColumn('uuid')
   id: string

   @ManyToOne(() => Rooms, (room) => room.id)
   room: Rooms

   @Column()
   roomId: string

   @Column()
   fromUser: number

   @Column()
   toUser: number

   @Column()
   message: string

   @Column({ enum: ['sent', 'delivered', 'failed', 'read', 'block'], nullable: true })
   status: string

   @Column({ default: false })
   isRead: boolean

   @Column({ type: 'timestamp', nullable: true })
   sentAt: Date

   @Column({ type: 'timestamp', nullable: true })
   readAt: Date

   @Column({ type: 'timestamp', nullable: true })
   deletedAtUser1: Date

   @Column({ type: 'timestamp', nullable: true })
   deletedAtUser2: Date

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   createdAt: Date

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   updatedAt: Date
}

