import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';
import { UserService } from 'src/user/service/user.service';
import { UserModule } from 'src/user/module/user.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { JwtService } from '@nestjs/jwt/dist';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule,
  ],
  providers: [
    JwtStrategy,
    UserService,
    ConfigService,
    PrismaService,
    AuthService,
    JwtService,
  ],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
