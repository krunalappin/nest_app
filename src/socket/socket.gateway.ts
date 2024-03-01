import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { RoomService } from './rooms/room.service';
import { Rooms } from './rooms/entity/room.entity';

// @UseGuards(SocketAuthGuard)
@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection , OnGatewayDisconnect  {

  @WebSocketServer()
  server: Server

  constructor(
    private readonly socketService: SocketService,
    private readonly roomService: RoomService
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
    const room = this.roomService.createRoom(senderId,receiverId);
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
