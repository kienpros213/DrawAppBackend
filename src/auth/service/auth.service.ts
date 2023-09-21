import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UserService } from 'src/user/service/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(userData: UserModel): Promise<any> {
        const user = await this.userService.findWithUserName(userData);
        if (user?.password !== userData.password) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username };
        console.log(payload)
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
