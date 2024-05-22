import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Param,
  Get,
} from '@nestjs/common';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { PayableService } from './payable.service';
import { Payable } from '@prisma/client';

@Controller('integrations/payable')
export class PayableController {
  constructor(private payableService: PayableService) {}

  @Post()
  async createPayable(@Body() createPayableDto: CreatePayableDto) {
    this.payableService.create(createPayableDto);
    return createPayableDto;
  }

  @Get(':id')
  async getPayable(@Param('id') id: string): Promise<Payable> {
    const payable = await this.payableService.findOne(id);
    if (!payable) {
      throw new NotFoundException(`Payable with id ${id} not found`);
    }
    return payable;
  }
}
