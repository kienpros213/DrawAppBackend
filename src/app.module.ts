import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/module/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    AuthModule,
  ],
})
export class AppModule { }
