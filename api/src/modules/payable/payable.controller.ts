import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Param,
  Get,
  Delete,
  ConflictException,
} from '@nestjs/common';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { PayableService } from './payable.service';
import { Payable } from '@prisma/client';

@Controller('integrations/payable')
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @Post()
  async createPayable(
    @Body() createPayableDto: CreatePayableDto,
  ): Promise<CreatePayableDto> {
    const existingAssignor = await this.payableService.findAssignorByDocument(
      createPayableDto.assignorId,
    );
    if (existingAssignor) {
      throw new ConflictException(
        `Assignor with document ${createPayableDto.assignorId} already exists`,
      );
    }
    await this.payableService.create(createPayableDto);
    return createPayableDto;
  }

  @Get()
  async findAll(): Promise<Payable[]> {
    return this.payableService.findAll();
  }

  @Get(':id')
  async getPayable(@Param('id') id: string): Promise<Payable> {
    const payable = await this.payableService.findOne(id);
    if (!payable) {
      throw new NotFoundException(`Payable with id ${id} not found`);
    }
    return payable;
  }

  @Delete(':id')
  async softDeletePayable(@Param('id') id: string): Promise<Payable> {
    const payable = await this.payableService.findOne(id);
    if (!payable) {
      throw new NotFoundException(`Payable with id ${id} not found`);
    }
    return this.payableService.softDelete(id);
  }
}
