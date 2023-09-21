import { Controller, Post, Get, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { User as UserModel } from '@prisma/client';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard)
    @Get('get')
    hello() {
        return "hello"
    }

    @Post('login')
    login(@Body() userData: UserModel) {
        return this.authService.signIn(userData)
    }

}
