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
const concatArrayBuffer_1 = require("../utils/concatArrayBuffer");
let WebsocketGateway = class WebsocketGateway {
    constructor() {
        this.roomDrawState = {};
        this.online = [];
        this.receivedChunks = [];
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
                drawState: { model: { shapeIndex: 0 }, penDraw: { shapeIndex: 0 }, freeDraw: { shapeIndex: 0 } }
            };
        }
        this.roomDrawState['room: ' + roomName + ''].clientId.push(client.id);
        client.emit('roomJoined', this.roomDrawState['room: ' + roomName + '']);
    }
    handleFreeDraw(client, payload) {
        if (payload.room) {
            const roomKey = 'room: ' + payload.room;
            const shapeIndex = this.roomDrawState[roomKey].drawState.freeDraw.shapeIndex;
            if (!this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex]) {
                this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex] = [];
            }
            this.roomDrawState[roomKey].drawState.freeDraw[shapeIndex].push(payload.drawPos);
            console.log('roomDrawState', this.roomDrawState[roomKey].drawState.freeDraw);
            client.to(payload.room).emit('serverFreeDraw', { id: client.id, data: payload.drawPos });
        }
    }
    handleClientStopDraw(client, payload) {
        if (payload.room) {
            console.log(payload);
            const roomKey = 'room: ' + payload;
            this.roomDrawState[roomKey].drawState.freeDraw.shapeIndex += 1;
            client.to(payload).emit('serverStopFreeDraw', client.id);
        }
    }
    handlePenDraw(client, payload) {
        if (payload.room) {
            const roomKey = 'room: ' + payload.room;
            const shapeIndex = this.roomDrawState[roomKey].drawState.penDraw.shapeIndex;
            if (!this.roomDrawState[roomKey].drawState.penDraw[shapeIndex]) {
                this.roomDrawState[roomKey].drawState.penDraw[shapeIndex] = [];
            }
            this.roomDrawState[roomKey].drawState.penDraw[shapeIndex].push(payload.drawPos);
            console.log('roomDrawState', this.roomDrawState[roomKey].drawState.penDraw);
            this.roomDrawState[roomKey].drawState.penDraw.shapeIndex += 1;
            client.to(payload.room).emit('serverPenDraw', { id: client.id, data: payload.drawPos });
        }
    }
    handleLoadModel(client, payload) {
        if (payload.room) {
            const roomKey = 'room: ' + payload.room;
            const shapeIndex = this.roomDrawState[roomKey].drawState.model.shapeIndex;
            this.receivedChunks.push(payload.data);
            const combinedBuffer = (0, concatArrayBuffer_1.concatArrayBuffer)(...this.receivedChunks);
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
    handleTransform(client, payload) {
        console.log(payload);
        client.to(payload.room).emit('serverTransfrom', payload);
    }
    handleEndTransform(client, payload) {
        if (payload.room) {
            const roomKey = 'room: ' + payload.room;
            const modelName = payload.name;
            const position = Object.values(payload.position);
            const rotation = Object.values(payload.rotation);
            const scale = Object.values(payload.scale);
            for (const key in this.roomDrawState[roomKey].drawState.model) {
                if (this.roomDrawState[roomKey].drawState.model.hasOwnProperty(key) &&
                    typeof this.roomDrawState[roomKey].drawState.model[key] === 'object') {
                    const currentObject = this.roomDrawState[roomKey].drawState.model[key];
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
__decorate([
    (0, websockets_1.SubscribeMessage)('endTransform'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleEndTransform", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map