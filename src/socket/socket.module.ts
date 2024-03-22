import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/session/session.module';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from './chat/chat.module';
import { Sockets } from './entity/socket.entity';
import { RoomModule } from './rooms/room.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sockets]),
    forwardRef(() => RoomModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    SessionModule,
    ChatModule,
  ],
  providers: [SocketGateway, SocketService],
  exports: [SocketService]
})
export class SocketModule { }
