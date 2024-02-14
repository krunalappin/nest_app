import { Products } from "src/product/entity/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categories {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;

    @OneToMany(() => Products, (product) => product.category)
    products: Products[];
    
}



