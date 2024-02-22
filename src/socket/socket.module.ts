import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [SocketService , WebsocketGateway]
})
export class SocketModule {}
