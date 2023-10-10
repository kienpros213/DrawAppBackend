import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findWithUserName(username): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: {
        username: username
      }
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserModel[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserModel> {
    return this.prisma.user.create({
      data
    });
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<UserModel> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserModel> {
    return this.prisma.user.delete({
      where
    });
  }
}
