import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway()
export class WebsocketGateway {
    @WebSocketServer()
    server: Server

   @SubscribeMessage('msgToServer')
   handleMessage(client: any, payload: any): string {
        console.log(payload);
        return 'Hello world!';
    }


}