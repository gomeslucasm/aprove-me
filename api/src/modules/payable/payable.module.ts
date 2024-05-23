import { Module } from '@nestjs/common';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PayableController],
  providers: [PayableService],
})
export class PayableModule {}
