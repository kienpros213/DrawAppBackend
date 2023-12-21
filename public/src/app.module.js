"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/module/user.module");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/module/auth.module");
const auth_controller_1 = require("./auth/controller/auth.controller");
const websocket_gateway_1 = require("./websocket/websocket.gateway");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, config_1.ConfigModule.forRoot(), auth_module_1.AuthModule],
        providers: [app_service_1.AppService, websocket_gateway_1.WebsocketGateway],
        controllers: [auth_controller_1.AuthController]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map