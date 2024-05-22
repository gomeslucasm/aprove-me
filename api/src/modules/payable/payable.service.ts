import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { Payable } from '@prisma/client';

@Injectable()
export class PayableService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPayableDto: CreatePayableDto): Promise<Payable> {
    return this.prisma.payable.create({
      data: {
        id: createPayableDto.id,
        value: createPayableDto.value,
        emissionDate: new Date(createPayableDto.emissionDate),
        assignor: {
          connect: { id: createPayableDto.assignor },
        },
      },
    });
  }

  async findAll(): Promise<Payable[]> {
    return this.prisma.payable.findMany();
  }

  async findOne(id: string): Promise<Payable | null> {
    return this.prisma.payable.findUnique({
      where: { id },
    });
  }
}
