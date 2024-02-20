import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "src/product/model/product.model";
import { User } from "src/user/model/user.model";

@ObjectType()
export class Order {
    @Field(() => String)
    id: string

    @Field(() => User)
    user: User

    @Field(() => Product)
    product: Product

    @Field(() => Int)
    quantity: number

    @Field(() => Float)
    total_price: number

    @Field(() => Date)
    created_at: Date
}