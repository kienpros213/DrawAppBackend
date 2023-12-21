import { PrismaService } from 'prisma/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findUser(username: string): Promise<UserModel | null>;
    findUserByEmail(email: string): Promise<UserModel | null>;
    createUser(data: Prisma.UserCreateInput): Promise<UserModel>;
    updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<UserModel>;
    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserModel>;
}
