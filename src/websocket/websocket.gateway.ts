import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { concatArrayBuffer } from 'src/utils/concatArrayBuffer';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private roomDrawState: object = {};
  private online: Array<string> = [];
  private receivedChunks: Array<ArrayBuffer> = [];

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
        drawState: { model: { shapeIndex: 0 }, penDraw: { shapeIndex: 0 }, freeDraw: { shapeIndex: 0 } }
      };
    }
    this.roomDrawState['room: ' + roomName + ''].clientId.push(client.id);
    client.emit('roomJoined', this.roomDrawState['room: ' + roomName + '']);
  }

  @SubscribeMessage('freeDraw')
  handleFreeDraw(client: Socket, payload: any): void {
    if (payload.room) {
      const roomKey = 'room: ' + payload.room;
      //emit draw instruction for other client

      const shapeIndex = this.roomDrawState[roomKey].drawState.freeDraw.shapeIndex;

      //create new shape array
      if (!this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex]) {
        this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex] = [];
      }

      //push into shape array
      this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex].push(payload.drawPos);
      console.log('roomDrawState', this.roomDrawState[roomKey].drawState.freeDraw);
      client.to(payload.room).emit('serverFreeDraw', { id: client.id, data: payload.drawPos });
    }
  }

  @SubscribeMessage('stopFreeDraw')
  handleClientStopDraw(client: Socket, payload: any): void {
    if (payload.room) {
      console.log(payload);
      const roomKey = 'room: ' + payload;

      this.roomDrawState[roomKey].drawState.freeDraw.shapeIndex += 1;
      client.to(payload).emit('serverStopFreeDraw', client.id);
    }
  }

  @SubscribeMessage('penDraw')
  handlePenDraw(client: Socket, payload: any): void {
    if (payload.room) {
      const roomKey = 'room: ' + payload.room;
      //emit draw instruction for other client

      const shapeIndex = this.roomDrawState[roomKey].drawState.penDraw.shapeIndex;

      //create new shape array
      if (!this.roomDrawState[roomKey].drawState.penDraw[shapeIndex]) {
        this.roomDrawState[roomKey].drawState.penDraw[shapeIndex] = [];
      }

      //push into shape array
      this.roomDrawState[roomKey].drawState.penDraw[shapeIndex].push(payload.drawPos);
      console.log('roomDrawState', this.roomDrawState[roomKey].drawState.penDraw);
      this.roomDrawState[roomKey].drawState.penDraw.shapeIndex += 1;
      client.to(payload.room).emit('serverPenDraw', { id: client.id, data: payload.drawPos });
    }
  }

  @SubscribeMessage('loadModel')
  handleLoadModel(client: Socket, payload: any): void {
    if (payload.room) {
      // client.broadcast.emit('serverLoadModel', payload)
      const roomKey = 'room: ' + payload.room;

      const shapeIndex = this.roomDrawState[roomKey].drawState.model.shapeIndex;

      this.receivedChunks.push(payload.data);
      const combinedBuffer = concatArrayBuffer(...this.receivedChunks);
      if (!this.roomDrawState[roomKey].drawState.model[shapeIndex]) {
        this.roomDrawState[roomKey].drawState.model[shapeIndex] = {
          name: payload.fileName,
          position: [],
          rotation: [],
          scale: [],
          data: []
        };
      }

      this.roomDrawState[roomKey].drawState.model[shapeIndex].data.push(payload.data);

      if (combinedBuffer.byteLength === payload.byteLength) {
        console.log(this.roomDrawState[roomKey].drawState.model);
        this.roomDrawState[roomKey].drawState.model.shapeIndex += 1;
        this.receivedChunks = [];
      }
    }
    console.log();
    client.to(payload.room).emit('serverLoadModel', payload);
  }

  @SubscribeMessage('transform')
  handleTransform(client: Socket, payload: any): void {
    console.log(payload);
    client.to(payload.room).emit('serverTransfrom', payload);
  }

  @SubscribeMessage('endTransform')
  handleEndTransform(client: Socket, payload: any): void {
    if (payload.room) {
      const roomKey = 'room: ' + payload.room;
      const modelName = payload.name;
      const position = Object.values(payload.position);
      const rotation = Object.values(payload.rotation);
      const scale = Object.values(payload.scale);

      for (const key in this.roomDrawState[roomKey].drawState.model) {
        if (
          this.roomDrawState[roomKey].drawState.model.hasOwnProperty(key) &&
          typeof this.roomDrawState[roomKey].drawState.model[key] === 'object'
        ) {
          const currentObject = this.roomDrawState[roomKey].drawState.model[key];

          // Check if the current object has the target name
          if (currentObject.name === modelName) {
            for (let i = 0; i < 3; i++) {
              currentObject.position[i] = position[i];
              currentObject.rotation[i] = rotation[i];
              currentObject.scale[i] = scale[i];
            }
            console.log(currentObject.position);
            break;
          }
        }
      }
    }
  }
}
