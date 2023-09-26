import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { User as UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @UseGuards(AuthGuard('local'))
    @Post('login')
    login(@Body() userData: UserModel) {
        console.log(userData)
        return this.authService.generateJwt(userData)
    }

    @UseGuards(JwtAuthGuard)
    @Get('get')
    getProfile() {
        return "the profile";
    }
}
