import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rooms } from "./entity/room.entity";
import { RoomService } from "./room.service";
import { SocketModule } from "../socket.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Rooms]),
        forwardRef(() => SocketModule),
    ],
    controllers: [],
    providers: [RoomService],
    exports: [RoomService]
})
export class RoomModule {}