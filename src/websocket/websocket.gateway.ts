import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getRoomDrawState } from 'src/utils/getRoomDrawState';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private roomDrawState = {};
  private online = [];

  handleConnection(client: Socket, payload: any): void {
    console.log('A user connected');
  }

  @SubscribeMessage('connected')
  handleNewUser(client: Socket, payload: any): void {
    if (!this.online.includes(payload.username)) {
      this.online.push(payload.username);
    }
    this.server.emit('userConnected', this.online);
  }

  handleDisconnect(client: Socket): void {
    console.log('A user disconnect');
    const clienIndex = this.online.indexOf(client.id);
    this.online.splice(clienIndex, 1);
    this.server.emit('userDisconnected', this.online);
  }

  //////////join room//////////
  @SubscribeMessage('joinRequest')
  handleJoinRequest(client: Socket, roomName: any): void {
    client.join(roomName);
    if (!this.roomDrawState['room: ' + roomName + '']) {
      this.roomDrawState['room: ' + roomName + ''] = { clientId: [], shapeIndex: 0, drawState: {} };
    }
    this.roomDrawState['room: ' + roomName + ''].clientId.push(client.id);
    client.emit('roomJoined', this.roomDrawState['room: ' + roomName + '']);
    // console.log(this.roomDrawState);
  }

  @SubscribeMessage('clientThree')
  handleThree(client: Socket, payload: any): void {
    const roomKey = 'room: ' + payload.room;
    client.to(payload.room).emit('serverThree', { id: client.id, data: payload.drawPos });

    // Get the current shapeIndex
    const shapeIndex = this.roomDrawState[roomKey].shapeIndex;

    // Initialize drawState if it doesn't exist for the current shapeIndex
    if (!this.roomDrawState[roomKey].drawState[shapeIndex]) {
      this.roomDrawState[roomKey].drawState[shapeIndex] = [];
    }

    // Push data into drawState under the current shapeIndex
    this.roomDrawState[roomKey].drawState[shapeIndex].push(payload.drawPos);
  }

  @SubscribeMessage('clientStopDraw')
  handleClientStopDraw(client: Socket, payload: any): void {
    console.log(payload);
    const roomKey = 'room: ' + payload;

    client.to(payload).emit('serverStopDraw', client.id);

    // Increment the shapeIndex
    this.roomDrawState[roomKey].shapeIndex += 1;
    console.log(this.roomDrawState[roomKey].shapeIndex);
    console.log(this.roomDrawState);
  }

  // //////////brush listener//////////
  // @SubscribeMessage('clientBrushDraw')
  // handleClientBrushDraw(client: Socket, payload: any): void {
  //   client.to(payload.room).emit('serverBrushDraw', payload);
  //   const getBrushDrawState = getRoomDrawState(this.roomDrawState, payload);
  //   getBrushDrawState[payload.room][payload.tool].push(payload);
  // }

  // //////////circle listener//////////
  // @SubscribeMessage('clientCircleDraw')
  // handleClientCircleDraw(client: Socket, payload: any): void {
  //   client.to(payload.room).emit('serverCircleDraw', payload);
  // }

  // @SubscribeMessage('clientPushCircle')
  // handleClientPushCircle(client: Socket, payload: any): void {
  //   client.to(payload.room).emit('serverPushCircle', payload);
  //   const getCircleDrawState = getRoomDrawState(this.roomDrawState, payload);
  //   getCircleDrawState[payload.room][payload.tool].push(payload);
  // }

  // //////////rectangle listener//////////
  // @SubscribeMessage('clientRectDraw')
  // handleClientRectDraw(client: Socket, payload: any): void {
  //   client.to(payload.room).emit('serverRectDraw', payload);
  // }

  // @SubscribeMessage('clientPushRect')
  // handleClientPushRect(client: Socket, payload: any): void {
  //   client.to(payload.room).emit('serverPushRect', payload);
  //   const getRectDrawState = getRoomDrawState(this.roomDrawState, payload);
  //   getRectDrawState[payload.room][payload.tool].push(payload);
  // }

  // //////////eraser listener//////////
  // @SubscribeMessage('clientEraserDraw')
  // handleClientEraserDraw(client: Socket, payload: any): void {
  //   client.to(payload.room).emit('serverEraserDraw', payload);
  // }

  // //////////freeShape listener//////////
  // @SubscribeMessage('clientFreeShapeDraw')
  // handleClientFreeShapeDraw(client: Socket, payload: any): void {
  //   client.to(payload.room).emit('serverFreeShapeDraw', payload);
  // }

  // @SubscribeMessage('clientStopFreeShape')
  // handleClientStopFreeShape(client: Socket, payload: any): void {
  //   // client.broadcast.emit("serverStopFreeShape",);
  //   client.to(payload.room).emit('serverStopFreeShape', payload);
  //   const getFreeShapeDrawState = getRoomDrawState(this.roomDrawState, payload);
  //   getFreeShapeDrawState[payload.room][payload.tool].push(payload);
  // }

  // //////////mouse location listener//////////
  // @SubscribeMessage('mouseLocation')
  // handleMouseLocation(client: Socket, payload: any): void {
  //   console.log(payload);
  //   client.to(payload.room).emit('serverMouseLocation', payload);
  // }

  // //////////clear canvas listener//////////
  // @SubscribeMessage('clientClearCanvas')
  // handleClientClearCanvas(client: Socket, payload: any): void {
  //   console.log(payload);
  //   console.log(this.roomDrawState[payload.room].clientId);
  // }
}
