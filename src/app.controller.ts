import { Controller, UseGuards, Post, Request, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth/service/auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('/')
export class AppController {
  @Get('/')
  welcome() {
    return 'welcum';
  }
}
