import { User } from "src/user/entity/user.entity"

export class UserSessionDto{
    access_token : string
    user : User
    ip : string
}