"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let WebsocketGateway = class WebsocketGateway {
    constructor() {
        this.roomDrawState = {};
        this.online = [];
    }
    handleConnection(client, payload) {
        console.log('A user connected');
    }
    handleNewUser(client, payload) {
        if (!this.online.includes(payload.username)) {
            this.online.push(payload.username);
        }
        this.server.emit('userConnected', this.online);
    }
    handleDisconnect(client) {
        console.log('A user disconnect');
        const clienIndex = this.online.indexOf(client.id);
        this.online.splice(clienIndex, 1);
        this.server.emit('userDisconnected', this.online);
    }
    handleJoinRequest(client, roomName) {
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
    handleFreeDraw(client, payload) {
        const roomKey = 'room: ' + payload.room;
        client.to(payload.room).emit('serverFreeDraw', { id: client.id, data: payload.drawPos });
        const shapeIndex = this.roomDrawState[roomKey].drawState.freeDraw.shapeIndex;
        if (!this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex]) {
            this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex] = [];
        }
        this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex].push(payload.drawPos);
        console.log('roomDrawState', this.roomDrawState[roomKey].drawState.freeDraw);
    }
    handleClientStopDraw(client, payload) {
        console.log(payload);
        const roomKey = 'room: ' + payload;
        client.to(payload).emit('serverStopFreeDraw', client.id);
        this.roomDrawState[roomKey].drawState.freeDraw.shapeIndex += 1;
    }
    handlePenDraw(client, payload) {
        const roomKey = 'room: ' + payload.room;
        client.to(payload.room).emit('serverPenDraw', { id: client.id, data: payload.drawPos });
        const shapeIndex = this.roomDrawState[roomKey].drawState.penDraw.shapeIndex;
        if (!this.roomDrawState[roomKey].drawState.penDraw[shapeIndex]) {
            this.roomDrawState[roomKey].drawState.penDraw[shapeIndex] = [];
        }
        this.roomDrawState[roomKey].drawState.penDraw[shapeIndex].push(payload.drawPos);
        console.log('roomDrawState', this.roomDrawState[roomKey].drawState.penDraw);
        this.roomDrawState[roomKey].drawState.penDraw.shapeIndex += 1;
    }
    handleLoadModel(client, payload) {
        console.log(payload.fileLength);
        client.broadcast.emit('serverLoadModel', payload);
    }
    handleTransform(client, payload) {
        console.log(payload);
        client.broadcast.emit('serverTransfrom', payload);
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('connected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleNewUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRequest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleJoinRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('freeDraw'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleFreeDraw", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stopFreeDraw'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleClientStopDraw", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('penDraw'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handlePenDraw", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('loadModel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleLoadModel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('transform'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleTransform", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map