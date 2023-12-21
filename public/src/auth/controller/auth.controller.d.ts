import { AuthService } from '../service/auth.service';
import { User as UserModel } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(userData: UserModel): Promise<{
        access_token: string;
    }>;
    getProfile(): string;
}
