import { Categories } from "src/categories/entity/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Products {

    @PrimaryGeneratedColumn('uuid')
    id : number;

    @Column()
    product_name : string;

    @Column()
    unit : string;

    @Column()
    price : number;

    @ManyToOne(() => Categories, (category) => category.products)
    @JoinColumn({name : 'category_id'})
    category : Categories;
}

