import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
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
