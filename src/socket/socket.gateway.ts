import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { RoomService } from './rooms/room.service';
import { Rooms } from './rooms/entity/room.entity';
import { ChatService } from './chat/chat.service';
import { UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from 'src/auth/auth.socket.guard';
import { Public } from 'src/constants/message-constants';

@WebSocketGateway()
// @Public()
@UseGuards(SocketAuthGuard)
export class SocketGateway implements OnGatewayConnection , OnGatewayDisconnect  {
  
  @WebSocketServer()
  server: Server
  
  constructor(
    private readonly socketService: SocketService,
    private readonly roomService: RoomService,
    private readonly chatService: ChatService
    ) { }
    
    handleConnection(client: Socket) {
      client.emit('connected', `Welcome to the chat! ${client.id}`);
      return this.socketService.create(client);
    }
    
    handleDisconnect(client: Socket) {
      client.emit('disconnected', `Goodbye! ${client.id}`);
      return this.socketService.disconnectSocket(client);
    }
    
  @SubscribeMessage('createChat')
  handleCreateChat(@ConnectedSocket() client: Socket , @MessageBody() { senderId, receiverId }: { senderId: number, receiverId: number })  {
     return this.roomService.createRoom(senderId,receiverId,client);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket ) {
    const roomId = client.handshake.query.roomId;
    client.to(roomId).emit('message', message + ' ' + client.id);
    return this.chatService.createChat(message, client);
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket): void {
    const roomId = client.handshake.query.roomId as string;
    client.join(roomId);
    client.emit('joined', `You joined ${roomId}`);
    client.to(roomId).emit('joined', `${client.id} joined ${roomId}`);
  }

}
