import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DistanceRangeModel {
    @Field()
    id?: number

    @Field()
    from?: number

    @Field()
    to?: number

}