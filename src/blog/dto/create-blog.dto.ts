import { IsNotEmpty } from "class-validator";
import { User } from "src/user/entity/user.entity";

export class CreateBlogDto {

    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    user: User;
}
