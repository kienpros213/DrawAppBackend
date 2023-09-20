import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/module/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module/auth.module';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    AuthModule,
    PassportModule
  ],
  providers: [AppService, LocalAuthGuard],
  controllers: [AppController],
})
export class AppModule { }
