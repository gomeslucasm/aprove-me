import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AssignorService } from './assignor.service';
import { CreateAssignorDto } from './dtos/create-assignor.dto';
import { UpdateAssignorDto } from './dtos/update-assignor.dto';
import { Assignor } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('integrations/assignor')
@UseGuards(JwtAuthGuard)
export class AssignorController {
  constructor(private readonly assignorService: AssignorService) {}

  @Post()
  async createAssignor(
    @Body() createAssignorDto: CreateAssignorDto,
  ): Promise<CreateAssignorDto> {
    await this.assignorService.create(createAssignorDto);
    return createAssignorDto;
  }

  @Get()
  async findAll(): Promise<Assignor[]> {
    return this.assignorService.findAll();
  }

  @Get(':id')
  async getAssignor(@Param('id') id: string): Promise<Assignor> {
    const assignor = await this.assignorService.findOne(id);
    return assignor;
  }

  @Patch(':id')
  async updateAssignor(
    @Param('id') id: string,
    @Body() updateAssignorDto: UpdateAssignorDto,
  ): Promise<Assignor> {
    return this.assignorService.update(id, updateAssignorDto);
  }

  @Delete(':id')
  async deleteAssignor(@Param('id') id: string): Promise<Assignor> {
    return this.assignorService.softDelete(id);
  }
}
