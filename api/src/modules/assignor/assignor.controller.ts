import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

import { AssignorService } from './assignor.service';
import { Assignor } from '@prisma/client';

@Controller('integrations/assignor')
export class AssignorController {
  constructor(private readonly assignorService: AssignorService) {}

  @Get(':id')
  async getAssignor(@Param('id') id: string): Promise<Assignor> {
    const assignor = await this.assignorService.findOne(id);
    if (!assignor) {
      throw new NotFoundException(`Assignor with id ${id} not found`);
    }
    return assignor;
  }
}
