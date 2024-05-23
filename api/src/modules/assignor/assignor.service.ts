import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Assignor } from '@prisma/client';
import { UpdateAssignorDto } from './dtos/update-assignor.dto';
import { BaseService } from '../../common/base/service';
import { CreateAssignorDto } from './dtos/create-assignor.dto';

@Injectable()
export class AssignorService extends BaseService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findOne(id: string): Promise<Assignor | null> {
    return this.prisma.assignor.findUnique({
      where: { id, ...this.getBaseFilter() },
    });
  }

  async create(createAssignorDto: CreateAssignorDto): Promise<Assignor> {
    return this.prisma.assignor.create({
      data: createAssignorDto,
    });
  }

  async findAll(): Promise<Assignor[]> {
    return this.prisma.assignor.findMany({
      where: {
        ...this.getBaseFilter(),
      },
    });
  }

  async update(
    id: string,
    updateAssignorDto: UpdateAssignorDto,
  ): Promise<Assignor> {
    return this.prisma.assignor.update({
      where: { ...this.getBaseFilter(), id },
      data: updateAssignorDto,
    });
  }

  async softDelete(id: string): Promise<Assignor> {
    return this.prisma.assignor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
