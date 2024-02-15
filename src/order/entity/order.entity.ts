import { Products } from "src/product/entity/product.entity"
import { User } from "src/user/entity/user.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"


@Entity()
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, (user) => user.order)
    @JoinColumn({name : 'user_id'})
    user: User

    @ManyToOne(() => Products, (product) => product.order)
    @JoinColumn({name : 'product_id'})
    product: Products

    @Column({default : 1})
    quantity: number

    @Column()
    total_price: number

    @Column({default : new Date()})
    created_at: Date
}