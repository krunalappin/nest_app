import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DistanceRangeDto {
    @Field({ nullable: true })
    id?: number;

    @Field({ nullable: true })
    from?: number;

    @Field({ nullable: true })
    to?: number;
}