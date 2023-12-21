import { User as UserModel } from '@prisma/client';
import { UserService } from 'src/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    generateJwt(user: UserModel): Promise<{
        access_token: string;
    }>;
}
