import { Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { SessionService } from "src/session/session.service";
import {  User } from "./model/user.model";

@Resolver('User')
export class UserResolver {
    constructor(
        private readonly userService:UserService,
    ){}

    @Query(() => [User])
    async getAllUsers(){
        const users = await this.userService.getAllUsers();
        return users;
    }
    
}