import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Assignor } from '@prisma/client';

@Injectable()
export class AssignorService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<Assignor | null> {
    return this.prisma.assignor.findUnique({
      where: { id },
    });
  }
}
