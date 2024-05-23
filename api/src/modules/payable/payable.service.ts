import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { Payable } from '@prisma/client';
import { BaseService } from '../../common/base/service';

@Injectable()
export class PayableService extends BaseService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(createPayableDto: CreatePayableDto): Promise<Payable> {
    return this.prisma.payable.create({
      data: {
        id: createPayableDto.id,
        value: createPayableDto.value,
        emissionDate: new Date(createPayableDto.emissionDate),
        assignorId: createPayableDto.assignorId,
      },
    });
  }

  async findOne(id: string): Promise<Payable | null> {
    return this.prisma.payable.findUnique({
      where: { id, ...this.getBaseFilter() },
    });
  }

  async findAll(): Promise<Payable[]> {
    return this.prisma.payable.findMany({
      where: {
        ...this.getBaseFilter(),
      },
    });
  }

  async softDelete(id: string): Promise<Payable> {
    return this.prisma.payable.update({
      where: { id, ...this.getBaseFilter() },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findAssignorByDocument(document: string) {
    return this.prisma.assignor.findUnique({
      where: { ...this.getBaseFilter(), document },
    });
  }
}
