import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthGuard } from 'src/auth/auth.socket.guard';
import { CreateChatDto } from './chat/dto/create-chat.dto';
import { SocketService } from './socket.service';

@WebSocketGateway()
@UseGuards(SocketAuthGuard)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server
  
  constructor(
    private readonly socketService: SocketService,
    ) { }
    
    handleConnection(client: Socket) {
      return this.socketService.handleConnection(client);
    }
    
    handleDisconnect(client: Socket) {
      return this.socketService.handleDisconnect(client);
    }
    
    @SubscribeMessage('createChat')
    handleCreateChat(@ConnectedSocket() client: Socket, @MessageBody() { senderId, receiverId }: { senderId: number, receiverId: number }) {
      return this.socketService.handleCreateChat(senderId, receiverId, client);
    }
    
    
    @SubscribeMessage('join')
    handleJoin(@ConnectedSocket() client: Socket, @MessageBody() { roomId }: { roomId: string }) {
    return this.socketService.handleJoinRoom(client, { roomId });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() createChatDto: CreateChatDto, @ConnectedSocket() client: Socket) {
    return this.socketService.handleMessages(createChatDto, client);
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
  handleMakeAsRead(@MessageBody() payload: { unreadMessageIds: string[], roomId: string }, @ConnectedSocket() client: Socket) {
    const { unreadMessageIds, roomId } = payload;
    return this.socketService.handleMakeAsRead(unreadMessageIds, client, roomId);
  }

  @SubscribeMessage('deleteMessages')
  handleDeleteMessage(@MessageBody() payload: { chatIds: string[] }, @ConnectedSocket() client: Socket) {
    const { chatIds } = payload;
    return this.socketService.handleDeleteMessage(chatIds, client);
  }

  @SubscribeMessage('deleteMessagesForEveryone')
  handleDeleteMessageForEveryone(@MessageBody() payload: { chatIds: string[] }, @ConnectedSocket() client: Socket) {
    const { chatIds } = payload;
    return this.socketService.handleDeleteMessageForEveryone(chatIds, client);
  }

  @SubscribeMessage('clearChat')
  handleClearChat(@MessageBody() { roomId }: { roomId: string }, @ConnectedSocket() client: Socket) {
    return this.socketService.handleClearChat({ roomId }, client);
  }

  @SubscribeMessage('editMessage')
  handleEditMessage(@MessageBody() payload: { chatId: string, message: string }, @ConnectedSocket() client: Socket) {
    const { chatId, message } = payload;
    return this.socketService.handleEditMessage(chatId, message, client);
  }

  @SubscribeMessage('blockUser')
  handleBlockUser(@MessageBody() Payload: { userId: number, roomId: string }, @ConnectedSocket() client: Socket) {
    const { userId, roomId } = Payload
    return this.socketService.handleBlockUser(userId, roomId, client);
  }

  @SubscribeMessage('unBlockUser')
  handleUnBlockUser(@MessageBody() Payload: { userId: number, roomId: string }, @ConnectedSocket() client: Socket) {
    const { userId, roomId } = Payload
    return this.socketService.handleUnBlockUser(userId, roomId, client);
  }

}
