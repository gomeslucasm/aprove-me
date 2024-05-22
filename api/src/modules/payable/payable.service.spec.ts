import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from './payable.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { Payable } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

describe('PayableService', () => {
  let service: PayableService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableService,
        {
          provide: PrismaService,
          useValue: {
            payable: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payable', async () => {
    const createPayableDto: CreatePayableDto = {
      id: uuidv4(),
      value: 1000,
      emissionDate: new Date().toISOString(),
      assignor: uuidv4(),
    };

    const createdPayable: Payable = {
      id: createPayableDto.id,
      value: createPayableDto.value,
      emissionDate: new Date(createPayableDto.emissionDate),
      assignorId: createPayableDto.assignor,
    };

    jest.spyOn(prisma.payable, 'create').mockResolvedValue(createdPayable);

    const result = await service.create(createPayableDto);
    expect(result).toEqual(createdPayable);
    expect(prisma.payable.create).toHaveBeenCalledWith({
      data: {
        id: createPayableDto.id,
        value: createPayableDto.value,
        emissionDate: new Date(createPayableDto.emissionDate),
        assignor: {
          connect: { id: createPayableDto.assignor },
        },
      },
    });
  });

  it('should return all payables', async () => {
    const payable1: Payable = {
      id: uuidv4(),
      value: 1000,
      emissionDate: new Date(),
      assignorId: uuidv4(),
    };
    const payable2: Payable = {
      id: uuidv4(),
      value: 2000,
      emissionDate: new Date(),
      assignorId: uuidv4(),
    };

    jest
      .spyOn(prisma.payable, 'findMany')
      .mockResolvedValue([payable1, payable2]);

    const result = await service.findAll();
    expect(result).toEqual([payable1, payable2]);
    expect(prisma.payable.findMany).toHaveBeenCalled();
  });

  it('should return a payable by id', async () => {
    const payable: Payable = {
      id: uuidv4(),
      value: 1000,
      emissionDate: new Date(),
      assignorId: uuidv4(),
    };

    jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(payable);

    const result = await service.findOne(payable.id);
    expect(result).toEqual(payable);
    expect(prisma.payable.findUnique).toHaveBeenCalledWith({
      where: { id: payable.id },
    });
  });

  it('should return null if payable not found', async () => {
    jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(null);

    const result = await service.findOne('wrong-id');
    expect(result).toBeNull();
    expect(prisma.payable.findUnique).toHaveBeenCalledWith({
      where: { id: 'wrong-id' },
    });
  });
});
