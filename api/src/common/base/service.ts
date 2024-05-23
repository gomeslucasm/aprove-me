import { Injectable, Scope, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { REQUEST } from '@nestjs/core';
import { RequestWithUser } from '../interfaces/request.interface';
import { UserRequest } from '../interfaces/user-request.interface';

@Injectable({ scope: Scope.REQUEST })
export class BaseService {
  protected prisma: PrismaService;
  protected readonly user: UserRequest;

  constructor(
    prisma: PrismaService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
  ) {
    this.prisma = prisma;
    this.user = this.request.user;
  }

  getBaseFilter(): { deletedAt: null } {
    return {
      deletedAt: null,
    };
  }
}
