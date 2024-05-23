import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(username: string, password: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }

  async findByUsername(username: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
