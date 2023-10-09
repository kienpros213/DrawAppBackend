import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getRoomDrawState } from 'src/utils/getRoomDrawState';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private roomDrawState = {};
  
  handleConnection(client: Socket): void {
    console.log('A user connected');
  }

  handleDisconnect(client: Socket): void {
    console.log('A user disconnect');
  }


  @SubscribeMessage('joinRequest')
  handleJoinRequest(client: Socket, roomName: any): void {
    client.join(roomName)
    if (!this.roomDrawState[roomName]) {
      this.roomDrawState[roomName] = {};
    }
    
    if (!this.roomDrawState[roomName]["clientId"]) {
      this.roomDrawState[roomName]["clientId"] = [];
    }
    this.roomDrawState[roomName]["clientId"].push(client.id)
    client.emit('roomJoined', this.roomDrawState[1]);
    console.log(this.roomDrawState[roomName]);
  }

  @SubscribeMessage('clientBrushDraw')
  handleClientBrushDraw(client: Socket, payload: any): void {
    client.to(payload.room).emit("serverBrushDraw", payload)
    const getBrushDrawState = getRoomDrawState(this.roomDrawState, payload);
    getBrushDrawState[payload.room][payload.tool].push(payload);
    console.log(this.roomDrawState);
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
    const getCircleDrawState = getRoomDrawState(this.roomDrawState, payload);
    getCircleDrawState[payload.room][payload.tool].push(payload);
    console.log(getCircleDrawState);
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
    const getRectDrawState = getRoomDrawState(this.roomDrawState, payload);
    getRectDrawState[payload.room][payload.tool].push(payload);
    console.log(getRectDrawState);
  }

  @SubscribeMessage('clientEraserDraw')
  handleClientEraserDraw(client: Socket, payload: any): void {
    // client.broadcast.emit("serverEraserDraw", payload);
    client.to(payload.room).emit("serverEraserDraw", payload)
  }

  @SubscribeMessage('clientFreeShapeDraw')
  handleClientFreeShapeDraw(client: Socket, payload: any): void {
    // client.broadcast.emit("serverFreeShapeDraw", payload);
    client.to(payload.room).emit("serverFreeShapeDraw", payload)
  }

  @SubscribeMessage('clientStopFreeShape')
  handleClientStopFreeShape(client: Socket, payload: any): void {
    // client.broadcast.emit("serverStopFreeShape",);
    client.to(payload.room).emit("serverStopFreeShape", payload);
  }
  

}