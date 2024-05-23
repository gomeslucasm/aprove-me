import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; id: string }> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        username: user.username,
        id: user.id,
      };
    }
    return null;
  }

  async login(user: { username: string; id: string }) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createJwtWithAssignor(assignorId: string, user: User) {
    const payload = { userId: user.id, username: user.username, assignorId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
