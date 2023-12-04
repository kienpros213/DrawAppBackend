import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(username: string): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: {
        username: username
      }
    });
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email
      }
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserModel> {
    const existingUser = await Promise.all([this.findUser(data.username), this.findUserByEmail(data.email)]);

    if (existingUser[0]) {
      throw new ConflictException('Username already exists');
    }

    if (existingUser[1]) {
      throw new ConflictException('Email already exists');
    }

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
