import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductDto {

  @Field({ nullable: true })
  product_name?: string;

  @Field({ nullable: true })
  unit?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  category_id?: number;
}
