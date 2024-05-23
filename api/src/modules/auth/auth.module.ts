import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ENVIRONMENT } from '../../common/constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ENVIRONMENT.SECRET_KEY,
      signOptions: { expiresIn: ENVIRONMENT.JWT_EXPIRES_IN },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
