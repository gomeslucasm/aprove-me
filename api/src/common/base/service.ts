import { PrismaService } from '../prisma/prisma.service';

export class BaseService {
  protected prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  getBaseFilter(): object {
    return {
      deletedAt: null,
    };
  }
}
