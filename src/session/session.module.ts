import { Module, Session } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSession } from "./session.entity";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserSession]),
    ],
    controllers: [SessionController],
    providers: [SessionService],
    exports: [SessionService]
})
export class SessionModule { }