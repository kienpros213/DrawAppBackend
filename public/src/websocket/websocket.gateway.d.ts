import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private roomDrawState;
    private online;
    private receivedChunks;
    handleConnection(client: Socket, payload: any): void;
    handleNewUser(client: Socket, payload: any): void;
    handleDisconnect(client: Socket): void;
    handleJoinRequest(client: Socket, roomName: any): void;
    handleFreeDraw(client: Socket, payload: any): void;
    handleClientStopDraw(client: Socket, payload: any): void;
    handlePenDraw(client: Socket, payload: any): void;
    handleLoadModel(client: Socket, payload: any): void;
    handleTransform(client: Socket, payload: any): void;
    handleEndTransform(client: Socket, payload: any): void;
}
