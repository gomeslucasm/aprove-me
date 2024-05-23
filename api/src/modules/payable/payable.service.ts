import { Injectable } from '@nestjs/common';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { Payable } from '@prisma/client';
import { BaseService } from '../../common/base/service';

@Injectable()
export class PayableService extends BaseService {
  getPayableBoundariesFilter(): {
    assignorId: string;
    deletedAt: null;
  } {
    return {
      assignorId: this.user.assignorId,
      ...this.getBaseFilter(),
    };
  }

  async create(createPayableDto: CreatePayableDto): Promise<Payable> {
    return this.prisma.payable.create({
      data: {
        id: createPayableDto.id,
        value: createPayableDto.value,
        emissionDate: new Date(createPayableDto.emissionDate),
        assignorId: this.user.assignorId,
      },
    });
  }

  async findOne(id: string): Promise<Payable | null> {
    return this.prisma.payable.findUnique({
      where: { id, ...this.getPayableBoundariesFilter() },
    });
  }

  async findAll(): Promise<Payable[]> {
    return this.prisma.payable.findMany({
      where: {
        ...this.getBaseFilter(),
        ...this.getPayableBoundariesFilter(),
      },
    });
  }

  async softDelete(id: string): Promise<Payable> {
    return this.prisma.payable.update({
      where: { id, ...this.getPayableBoundariesFilter() },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
