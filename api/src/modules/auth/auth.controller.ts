import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('integrations/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() body: { login: string; password: string }) {
    const user = await this.authService.validateUser(body.login, body.password);
    if (!user) {
      throw new UnauthorizedException('Not authorized');
    }
    return this.authService.login(user);
  }
}
