import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateGraphqlOrderDto {
    
    @Field({ nullable: true })
    user_id?: number

    @Field({ nullable: true })
    product_id?: string

    @Field({ nullable: true })
    quantity?: number
    
}