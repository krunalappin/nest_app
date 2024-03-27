import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { UserController } from "./user.controlller";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UserController],
    providers: [UserService, UserResolver],
    exports: [UserService, UserResolver],
})
export class UserModule { }