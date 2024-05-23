import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT } from '../../common/constants';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(login: string, password: string): Promise<any> {
    if (login === ENVIRONMENT.USERNAME && password === ENVIRONMENT.USERNAME) {
      return { login };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.login };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
