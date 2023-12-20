import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
      this.roomDrawState['room: ' + roomName + ''] = {
        clientId: [],
        drawState: { penDraw: { shapeIndex: 0 }, freeDraw: { shapeIndex: 0 } }
      };
    }
    this.roomDrawState['room: ' + roomName + ''].clientId.push(client.id);
    client.emit('roomJoined', this.roomDrawState['room: ' + roomName + '']);
  }

  @SubscribeMessage('freeDraw')
  handleFreeDraw(client: Socket, payload: any): void {
    const roomKey = 'room: ' + payload.room;
    //emit draw instruction for other client
    client.to(payload.room).emit('serverFreeDraw', { id: client.id, data: payload.drawPos });

    const shapeIndex = this.roomDrawState[roomKey].drawState.freeDraw.shapeIndex;

    //create new shape array
    if (!this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex]) {
      this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex] = [];
    }

    //push into shape array
    this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex].push(payload.drawPos);
    console.log('roomDrawState', this.roomDrawState[roomKey].drawState.freeDraw);
  }

  @SubscribeMessage('stopFreeDraw')
  handleClientStopDraw(client: Socket, payload: any): void {
    console.log(payload);
    const roomKey = 'room: ' + payload;

    client.to(payload).emit('serverStopFreeDraw', client.id);

    // Increment the shapeIndex
    this.roomDrawState[roomKey].drawState.freeDraw.shapeIndex += 1;
  }

  @SubscribeMessage('penDraw')
  handlePenDraw(client: Socket, payload: any): void {
    const roomKey = 'room: ' + payload.room;
    //emit draw instruction for other client
    client.to(payload.room).emit('serverPenDraw', { id: client.id, data: payload.drawPos });

    const shapeIndex = this.roomDrawState[roomKey].drawState.penDraw.shapeIndex;

    //create new shape array
    if (!this.roomDrawState[roomKey].drawState.penDraw[shapeIndex]) {
      this.roomDrawState[roomKey].drawState.penDraw[shapeIndex] = [];
    }

    //push into shape array
    this.roomDrawState[roomKey].drawState.penDraw[shapeIndex].push(payload.drawPos);
    console.log('roomDrawState', this.roomDrawState[roomKey].drawState.penDraw);
    this.roomDrawState[roomKey].drawState.penDraw.shapeIndex += 1;
  }
}
