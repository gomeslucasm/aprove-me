import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const existingUser = await this.userService.findByUsername(body.username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    return this.userService.create(body.username, body.password);
  }
}
