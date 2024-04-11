import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DistanceRangeDto {
    @Field({ nullable: true, defaultValue: 1 })
    id?: number;

    @Field({ nullable: true })
    from?: number;

    @Field({ nullable: true })
    to?: number;
}