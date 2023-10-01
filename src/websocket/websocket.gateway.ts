import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Buffer } from 'buffer';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private drawState: any[] = []

  handleConnection(client: Socket): void {
    this.server.emit('drawState', this.drawState);
    console.log('A user connected');
  }

  handleDisconnect(client: Socket): void {
    console.log('A user disconnect');
  }

  @SubscribeMessage('draw')
  handleClientEvent(client: Socket, payload: any): void {
    console.log(payload);
    this.drawState.push(payload.point)
    this.server.to(payload.roomName).emit('draw', payload.point);
  }

  @SubscribeMessage('joinRequest')
  handleJoinRequest(client: Socket, roomName: any): void {
    client.join(roomName)
    console.log(roomName)
  }

  @SubscribeMessage('clientBrushDraw')
  handleClientBrushDraw(client: Socket, payload: any): void {
    console.log(payload);
    this.drawState.push(payload);
    client.broadcast.emit("serverBrushDraw", payload);
  }

  @SubscribeMessage('clientCircleDraw')
  handleClientCircleDraw(client: Socket, payload: any): void {
    console.log(payload);
    client.broadcast.emit("serverCircleDraw", payload);
  }

  @SubscribeMessage('clientRectDraw')
  handleClientRectDraw(client: Socket, payload: any): void {
    console.log(payload);
    client.broadcast.emit("serverRectDraw", payload);
  }

  @SubscribeMessage('clientEraserDraw')
  handleClientEraserDraw(client: Socket, payload: any): void {
    console.log(payload);
    client.broadcast.emit("serverEraserDraw", payload);
  }

  

}