import { Categories } from "src/categories/entity/category.entity";
import { Orders } from "src/order/entity/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Products {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column()
    product_name : string;

    @Column()
    unit : string;

    @Column()
    price : number;

    @ManyToOne(() => Categories, (category) => category.products)
    @JoinColumn({name : 'category_id'})
    category : Categories;

    @OneToMany(() => Orders, (order) => order.product)
    order : Orders[]
    
}

