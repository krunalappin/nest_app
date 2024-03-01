import { Module } from "@nestjs/common";
import { UserController } from "./user.controlller";
import { UserService } from "./user.service";
import { User } from "./entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserResolver } from "./user.resolver";


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UserController],
    providers: [UserService , UserResolver],
    exports: [UserService , UserResolver],
})
export class UserModule { }