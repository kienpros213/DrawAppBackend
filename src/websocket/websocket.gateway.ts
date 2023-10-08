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


  @SubscribeMessage('joinRequest')
  handleJoinRequest(client: Socket, roomName: any): void {
    client.join(roomName)
  }

  @SubscribeMessage('clientBrushDraw')
  handleClientBrushDraw(client: Socket, payload: any): void {
    console.log("brush:", payload)
    // client.broadcast.emit("serverBrushDraw", payload);
    client.to(payload.room).emit("serverBrushDraw", payload)
  } 

  @SubscribeMessage('clientCircleDraw')
  handleClientCircleDraw(client: Socket, payload: any): void {
    // client.broadcast.emit("serverCircleDraw", payload);
    client.to(payload.room).emit("serverCircleDraw", payload)
  }

  @SubscribeMessage('clientPushCircle')
  handleClientPushCircle(client: Socket, payload: any): void {
    // client.broadcast.emit("serverPushCircle", payload);
    client.to(payload.room).emit("serverPushCircle", payload)
  }

  @SubscribeMessage('clientRectDraw')
  handleClientRectDraw(client: Socket, payload: any): void {
    // client.broadcast.emit("serverRectDraw", payload);
    client.to(payload.room).emit("serverRectDraw", payload)
  }

  @SubscribeMessage('clientPushRect')
  handleClientPushRect(client: Socket, payload: any): void {
    // client.broadcast.emit("serverPushRect", payload);
    client.to(payload.room).emit("serverPushRect", payload)
  }

  @SubscribeMessage('clientEraserDraw')
  handleClientEraserDraw(client: Socket, payload: any): void {
    // client.broadcast.emit("serverEraserDraw", payload);
    client.to(payload.room).emit("serverEraserDraw", payload)
  }

  @SubscribeMessage('clientFreeShapeDraw')
  handleClientFreeShapeDraw(client: Socket, payload: any): void {
    console.log(payload)
    // client.broadcast.emit("serverFreeShapeDraw", payload);
    client.to(payload.room).emit("serverFreeShapeDraw", payload)
  }

  @SubscribeMessage('clientStopFreeShape')
  handleClientStopFreeShape(client: Socket, payload: any): void {
    // client.broadcast.emit("serverStopFreeShape",);
    console.log("stop")
    client.to(payload.room).emit("serverStopFreeShape", payload);
  }

  
  @SubscribeMessage('sendSnapshot')
  handleSendSnapshot(client: Socket, payload: any): void {
    console.log(payload);
    // client.broadcast.emit("serverSendSnapshot", payload);
    client.to(payload.room).emit("serverSendSnapshot", payload);
  }
  

}