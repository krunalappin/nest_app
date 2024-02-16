import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field(type => Int)
    id: number;

    @Field(type => String)
    username?: string;

    @Field(type => String)
    email?: string;

    @Field(type => String)
    password?: string;

    @Field(type => String)
    bio?: string;

    @Field(type => String)
    fullname?: string;

    @Field(type => String)
    website?: string;

    @Field(type => String)
    phoneNumber?: string;

    // @Field(type => [Blog])
    // blog : Blog[]

    // @Field(type => UserSession)
    // session : UserSession

    // @Field(type => [Orders])
    // order : Orders[]
}