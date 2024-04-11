import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DistanceRange {

    @Field(type => Number)
    id? : number

    @Field(type => Number)
    from? : number

    @Field(type => Number)
    to? : number
}