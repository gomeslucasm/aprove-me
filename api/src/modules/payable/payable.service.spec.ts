import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from './payable.service';
import { Payable } from './interfaces/payable.interface';
import { v4 as uuidv4 } from 'uuid';

describe('PayableService', () => {
  let service: PayableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayableService],
    }).compile();

    service = module.get<PayableService>(PayableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payable', () => {
    const payable: Payable = {
      id: uuidv4(),
      value: 1000,
      emissionDate: new Date().toISOString(),
      assignor: uuidv4(),
    };

    service.create(payable);
    expect(service.findAll()).toContain(payable);
  });

  it('should return all payables', () => {
    const payable1: Payable = {
      id: uuidv4(),
      value: 1000,
      emissionDate: new Date().toISOString(),
      assignor: uuidv4(),
    };
    const payable2: Payable = {
      id: uuidv4(),
      value: 2000,
      emissionDate: new Date().toISOString(),
      assignor: uuidv4(),
    };

    service.create(payable1);
    service.create(payable2);

    expect(service.findAll()).toEqual([payable1, payable2]);
  });

  it('should return a payable by id', () => {
    const payable: Payable = {
      id: uuidv4(),
      value: 1000,
      emissionDate: new Date().toISOString(),
      assignor: uuidv4(),
    };

    service.create(payable);

    expect(service.findOne(payable.id)).toEqual(payable);
  });

  it('should return null if payable not found', () => {
    expect(service.findOne('non-existent-id')).toBeNull();
  });
});
