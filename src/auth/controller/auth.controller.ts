import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { User as UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @Post('login')
    login(@Body() userData: UserModel) {
        return this.authService.login(userData)
    }

    @UseGuards(JwtAuthGuard)
    @Get('get')
    getProfile(@Request() req) {
        return req.user
    }
}
