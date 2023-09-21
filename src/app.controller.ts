import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth/service/auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller()
export class AppController {

  constructor(private readonly authService: AuthService) { }
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  getProfile(@Request() req) {
    return req.user
  }

}
