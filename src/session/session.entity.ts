import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserSession {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.session)
    user: User
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    loginTime: Date

    @Column()
    ip: string

    @Column()
    access_token: string



}