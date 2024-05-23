import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ENVIRONMENT } from '../../common/constants';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AssignorService } from '../assignor/assignor.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: ENVIRONMENT.SECRET_KEY,
      signOptions: { expiresIn: ENVIRONMENT.JWT_EXPIRES_IN },
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    AssignorService,
    UserService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
