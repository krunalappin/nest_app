import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GraphqlOrderDto {
    
    @Field()
    user_id?: number

    @Field()
    product_id?: string

    @Field()
    quantity?: number

    // @Field()
    // total_price?: number

    // @Field()
    // created_at?: number

}