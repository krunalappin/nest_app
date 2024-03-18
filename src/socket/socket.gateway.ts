import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { RoomService } from './rooms/room.service';
import { UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from 'src/auth/auth.socket.guard';
import { CreateChatDto } from './chat/dto/create-chat.dto';

@WebSocketGateway()
@UseGuards(SocketAuthGuard)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  constructor(
    private readonly socketService: SocketService,
    private readonly roomService: RoomService,
  ) { }

  handleConnection(client: Socket) {
    return this.socketService.createSocket(client);
  }

  handleDisconnect(client: Socket) {
    return this.socketService.disconnectSocket(client);
  }

  @SubscribeMessage('createChat')
  handleCreateChat(@ConnectedSocket() client: Socket, @MessageBody() { senderId, receiverId }: { senderId: number, receiverId: number }) {
    return this.roomService.createRoom(senderId, receiverId, client);
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() { roomId }: { roomId: string }) {
    return this.socketService.handleJoinRoom(client, { roomId });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() createChatDto: CreateChatDto, @ConnectedSocket() client: Socket) {
    return this.socketService.handleMessages(createChatDto, client);
  }

  @SubscribeMessage('deleteMessages')
  handleDeleteMessage(@MessageBody() { id }: { id: string }, @ConnectedSocket() client: Socket) {
    return this.socketService.handleDeleteMessage({ id }, client);
  }

  @SubscribeMessage('getAllMessages')
  handleGetMessages(@MessageBody() { roomId }: { roomId: string }, @ConnectedSocket() client: Socket) {
    return this.socketService.handleGetMessages({ roomId }, client);
  }

  @SubscribeMessage('unReadMessages')
  handleUnReadMessages(@MessageBody() { roomId }: { roomId: string }, @ConnectedSocket() client: Socket) {
    return this.socketService.handleUnReadMessages({ roomId }, client);
  }

  @SubscribeMessage('makeAsRead')
  handleMakeAsRead(@MessageBody() payload: { unreadMessageIds: string[] }, @ConnectedSocket() client: Socket) {
    const { unreadMessageIds } = payload;
    return this.socketService.handleMakeAsRead(unreadMessageIds, client);
  }

}
