import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AssignorService } from '../assignor/assignor.service';
import { JwtAuthGuard } from './jwt.guard';
import { RequestWithUser } from 'src/common/interfaces/request.interface';

@Controller('integrations/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly assignorService: AssignorService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async login(@Body() body: { login: string; password: string }) {
    const user = await this.authService.validateUser(body.login, body.password);
    if (!user) {
      throw new UnauthorizedException('Not authorized');
    }
    return this.authService.login(user);
  }

  @Post('select-assignor')
  @UseGuards(JwtAuthGuard)
  async selectAssignor(
    @Body() body: { assignorId: string },
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const assignor = await this.assignorService.findOne(body.assignorId);
    if (!assignor) {
      throw new UnauthorizedException('Assignor not found');
    }
    return this.authService.createJwtWithAssignor(body.assignorId, user);
  }
}
