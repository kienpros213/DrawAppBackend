import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User as UserModel, Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createuser')
  async signupUser(@Body() userData: Prisma.UserCreateInput): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
