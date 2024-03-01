import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rooms } from "./entity/room.entity";
import { RoomService } from "./room.service";
import { User } from "src/user/entity/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Rooms]),
        TypeOrmModule.forFeature([User])
    ],
    controllers: [],
    providers: [RoomService],
    exports: [RoomService]
})
export class RoomModule {}