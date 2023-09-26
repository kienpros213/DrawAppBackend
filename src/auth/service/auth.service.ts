import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from 'src/user/service/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        console.log("valdate user inside auth service");
        const user = await this.userService.findWithUserName(username);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async generateJwt(user: UserModel) {
        console.log("generate jwt token")
        const payload = { username: user.username, sub: user.password };
        console.log(payload)
        const access_token = await this.jwtService.signAsync(payload)
        return {
            access_token
        };
    }
}
