import { UserService } from '../service/user.service';
import { User as UserModel, Prisma } from '@prisma/client';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signupUser(userData: Prisma.UserCreateInput): Promise<UserModel>;
    findUser(userWhereInputUnique: UserModel): Promise<UserModel>;
}
