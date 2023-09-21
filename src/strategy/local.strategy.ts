import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { User as UserModel } from '@prisma/client';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super()
    }

    async validate(userData: UserModel): Promise<any> {
        const user = await this.authService.validateUser(userData);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}