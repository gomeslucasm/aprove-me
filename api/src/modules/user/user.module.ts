import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
