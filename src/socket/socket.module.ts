import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Sockets } from './entity/socket.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/session/session.module';
import { RoomModule } from './rooms/room.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    SessionModule,
    TypeOrmModule.forFeature([Sockets]),
    TypeOrmModule.forFeature([User]),
    RoomModule,
    ChatModule
  ],
  providers: [SocketGateway, SocketService],
  exports: [SocketService]
})
export class SocketModule {}
