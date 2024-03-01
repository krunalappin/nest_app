import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { Request, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { SocketAuthGuard } from 'src/auth/auth.socket.guard';
import { User } from 'src/user/entity/user.entity';

// @UseGuards(SocketAuthGuard)
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {

  @WebSocketServer()
  client: Server

  constructor(
    private readonly socketService: SocketService
  ) { }

  
  handleConnection(client: any, user: User) {
    console.log('Client connected: ', client.id);
    client.emit('connected', `Welcome to the chat! ${client.id}`);
    return this.socketService.create(client);
  }


  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    client.broadcast.emit('message', message + ' ' + client.id);

  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
    client.join(room);
    client.emit('joined', `You joined ${room}`);
    client.broadcast.emit('joined', `${client.id} joined ${room}`);
  }

}
