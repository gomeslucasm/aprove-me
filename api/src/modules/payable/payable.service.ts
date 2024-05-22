import { Injectable } from '@nestjs/common';
import { Payable } from './interfaces/payable.interface';

@Injectable()
export class PayableService {
  private readonly payables: Payable[] = [];

  create(cat: Payable) {
    this.payables.push(cat);
  }

  findAll(): Payable[] {
    return this.payables;
  }

  findOne(payableId: string): Payable | null {
    return this.payables.find(({ id }) => id === payableId) ?? null;
  }
}
