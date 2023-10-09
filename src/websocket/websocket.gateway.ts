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

//////////join room//////////
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

  //////////brush listener//////////
  @SubscribeMessage('clientBrushDraw')
  handleClientBrushDraw(client: Socket, payload: any): void {
    client.to(payload.room).emit("serverBrushDraw", payload)
    const getBrushDrawState = getRoomDrawState(this.roomDrawState, payload);
    getBrushDrawState[payload.room][payload.tool].push(payload);
    console.log(this.roomDrawState);
  } 

  //////////circle listener//////////
  @SubscribeMessage('clientCircleDraw')
  handleClientCircleDraw(client: Socket, payload: any): void {
    client.to(payload.room).emit("serverCircleDraw", payload)
  }

  @SubscribeMessage('clientPushCircle')
  handleClientPushCircle(client: Socket, payload: any): void {
    client.to(payload.room).emit("serverPushCircle", payload)
    const getCircleDrawState = getRoomDrawState(this.roomDrawState, payload);
    getCircleDrawState[payload.room][payload.tool].push(payload);
    console.log(getCircleDrawState);
  }

  //////////rectangle listener//////////
  @SubscribeMessage('clientRectDraw')
  handleClientRectDraw(client: Socket, payload: any): void {
    client.to(payload.room).emit("serverRectDraw", payload)
  }

  @SubscribeMessage('clientPushRect')
  handleClientPushRect(client: Socket, payload: any): void {
    client.to(payload.room).emit("serverPushRect", payload)
    const getRectDrawState = getRoomDrawState(this.roomDrawState, payload);
    getRectDrawState[payload.room][payload.tool].push(payload);
    console.log(getRectDrawState);
  }

  //////////eraser listener//////////
  @SubscribeMessage('clientEraserDraw')
  handleClientEraserDraw(client: Socket, payload: any): void {
    client.to(payload.room).emit("serverEraserDraw", payload)
  }

  //////////freeShape listener//////////
  @SubscribeMessage('clientFreeShapeDraw')
  handleClientFreeShapeDraw(client: Socket, payload: any): void {
    client.to(payload.room).emit("serverFreeShapeDraw", payload)
  }

  @SubscribeMessage('clientStopFreeShape')
  handleClientStopFreeShape(client: Socket, payload: any): void {
    // client.broadcast.emit("serverStopFreeShape",);
    client.to(payload.room).emit("serverStopFreeShape", payload);
    const getFreeShapeDrawState = getRoomDrawState(this.roomDrawState, payload);
    getFreeShapeDrawState[payload.room][payload.tool].push(payload);
    console.log(getFreeShapeDrawState);
  }
  

}