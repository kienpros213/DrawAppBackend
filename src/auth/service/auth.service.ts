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

    async validateUser(userData: UserModel): Promise<any> {
        const user = await this.userService.findWithUserName(userData);
        if (user && user.password === userData.password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: UserModel) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.signAsync(payload),
        };
    }
}
