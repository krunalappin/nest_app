import { Field, ObjectType } from "@nestjs/graphql";
import { Category } from "src/categories/model/category.model";


@ObjectType()
export class Product {
    
    @Field(type => String)
    id : string

    @Field(type => String)
    product_name? : string

    @Field(type => String)
    unit? : string

    @Field(type => Number)
    price? : number

    @Field(() => Category , {nullable : true})
    category? : Category
}