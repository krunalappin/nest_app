import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { jwtConstants } from "./constants";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { SessionModule } from "src/session/session.module";

@Module({
    imports : [
        UserModule,
        SessionModule,
        JwtModule.register({
            secret : jwtConstants.secret,
            global : true,
            signOptions : {expiresIn : '10d'}
        })
    ],
    controllers : [AuthController],
    providers : [AuthService , AuthGuard],
    exports : [AuthService , AuthGuard]
})
export class AuthModule{}