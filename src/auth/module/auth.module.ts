import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from 'src/user/module/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { AuthController } from '../controller/auth.controller';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

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
  providers: [AuthService, LocalStrategy, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
