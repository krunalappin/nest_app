import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true})
    description: string;

    @ManyToOne(() => User, (user) => user.blog)
    user: User;

   
}
