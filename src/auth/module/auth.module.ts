import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from 'src/user/module/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { AuthController } from '../controller/auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService, LocalStrategy, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule { }
