import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductDto {

  @Field()
  product_name?: string;

  @Field()
  unit?: string;

  @Field()
  price?: number;

  @Field()
  category_id?: number;
}
