import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/module/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';
import { AuthController } from './auth/controller/auth.controller';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Module({
  imports: [UserModule, ConfigModule.forRoot(), AuthModule],
  providers: [AppService, WebsocketGateway],
  controllers: [AuthController]
})
export class AppModule {}
