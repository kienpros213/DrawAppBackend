import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket): void {
    console.log('A user connected');
  }

  handleDisconnect(client: Socket): void {
    console.log('A user disconnect');
  }

  @SubscribeMessage('chat message')
  handleChatMessage(client: Socket, msg: string): void {
    // Handle 'chat message' event
    this.server.emit('chat message', msg);
  }

  @SubscribeMessage('client')
  handleClientEvent(client: Socket, point: any): void {
    // Handle 'client' event
    console.log(point);
    this.server.emit('client', point);
  }

  // Add other event handlers as needed
}