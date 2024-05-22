import { Controller, Post, Body } from '@nestjs/common';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { PayableService } from './payable.service';

@Controller('integrations/payable')
export class PayableController {
  constructor(private payableService: PayableService) {}

  @Post()
  async createPayable(@Body() createPayableDto: CreatePayableDto) {
    this.payableService.create(createPayableDto);
    return createPayableDto;
  }
}
