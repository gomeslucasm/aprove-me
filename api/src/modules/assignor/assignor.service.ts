import { Injectable } from '@nestjs/common';
import { Assignor } from '@prisma/client';
import { UpdateAssignorDto } from './dtos/update-assignor.dto';
import { BaseService } from '../../common/base/service';
import { CreateAssignorDto } from './dtos/create-assignor.dto';

@Injectable()
export class AssignorService extends BaseService {
  getPayableBoundariesFilter(): {
    userId: string;
    deletedAt: null;
  } {
    return {
      userId: this.user.userId,
      ...this.getBaseFilter(),
    };
  }

  async findOne(id: string): Promise<Assignor | null> {
    return this.prisma.assignor.findUnique({
      where: { id, ...this.getBaseFilter() },
    });
  }

  async create(createAssignorDto: CreateAssignorDto): Promise<Assignor> {
    return this.prisma.assignor.create({
      data: { ...createAssignorDto, userId: this.user.userId },
    });
  }

  async findAll(): Promise<Assignor[]> {
    return this.prisma.assignor.findMany({
      where: {
        ...this.getPayableBoundariesFilter(),
      },
    });
  }

  async update(
    id: string,
    updateAssignorDto: UpdateAssignorDto,
  ): Promise<Assignor> {
    return this.prisma.assignor.update({
      where: { ...this.getPayableBoundariesFilter(), id },
      data: updateAssignorDto,
    });
  }

  async softDelete(id: string): Promise<Assignor> {
    return this.prisma.assignor.update({
      where: { id, ...this.getPayableBoundariesFilter() },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
