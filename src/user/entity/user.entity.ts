import { Blog } from "src/blog/entities/blog.entity";
import { Orders } from "src/order/entity/order.entity";
import { Products } from "src/product/entity/product.entity";
import { UserSession } from "src/session/session.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

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

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true , unique: true})
    phoneNumber: string;

    @OneToMany(() => Blog, (blog) => blog.user)
    blog: Blog[];

    @OneToMany(() => UserSession, (session) => session.user)
    session: UserSession[];

    @OneToMany(() => Orders, (order) => order.user)
    order: Orders[];


    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
    
}