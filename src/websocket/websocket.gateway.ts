import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private drawState: any[] = [];

  handleConnection(client: Socket): void {
    console.log('A user connected');
    this.server.emit('drawState', this.drawState);
  }

  handleDisconnect(client: Socket): void {
    console.log('A user disconnect');
  }

  @SubscribeMessage('chat message')
  handleChatMessage(client: Socket, msg: string): void {
    this.server.emit('chat message', msg);
  }

  @SubscribeMessage('client')
  handleClientEvent(client: Socket, point: any): void {
    console.log(point);
    this.drawState.push(point);
    client.broadcast.emit('client', point)

  }
}