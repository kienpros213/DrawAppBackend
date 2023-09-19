import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { User as UserModel, Prisma } from '@prisma/client'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: Prisma.UserWhereUniqueInput, password: Prisma.UserWhereInput): Promise<UserModel> {
        const userData = await this.userService.user(username);
        if (userData && userData.password === password) {
            return userData;
        }
        return null;
    }

    async login(user: UserModel) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async register(user: UserModel) {
        return this.userService.createUser(user);
    }
}
