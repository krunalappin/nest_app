import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class GraphqlProductDto {
    @Field()
    product_name: string

    @Field()
    unit: string;

    @Field()
    price: number;

    @Field()
    category_id: number
}


