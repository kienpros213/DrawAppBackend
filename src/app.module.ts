import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { UserModule } from './user/module/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';
import { AuthController } from './auth/controller/auth.controller';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    AuthModule,
  ],
  providers: [AppService, WebsocketGateway],
  controllers: [AuthController],
})
export class AppModule { }

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(),
  );

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Replace with the actual origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Set to true if you need to allow cookies with CORS
  });

  await app.listen(3030);
}
bootstrap();
