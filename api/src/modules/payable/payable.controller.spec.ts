import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { Payable } from '@prisma/client';

describe('PayableController', () => {
  let controller: PayableController;
  let service: PayableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [
        {
          provide: PayableService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PayableController>(PayableController);
    service = module.get<PayableService>(PayableService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a payable', async () => {
    const createPayableDto: CreatePayableDto = {
      id: uuidv4(),
      value: 1000,
      emissionDate: new Date().toISOString(),
      assignor: uuidv4(),
    };

    const createdPayable = {
      id: createPayableDto.id,
      value: createPayableDto.value,
      emissionDate: new Date(createPayableDto.emissionDate),
      assignorId: createPayableDto.assignor,
    };

    jest.spyOn(service, 'create').mockResolvedValue(createdPayable);

    const result = await controller.createPayable(createPayableDto);
    expect(result).toEqual(createPayableDto);
    expect(service.create).toHaveBeenCalledWith(createPayableDto);
  });

  it('should return a payable by id', async () => {
    const payableId = uuidv4();
    const payable: Payable = {
      id: payableId,
      value: 1000,
      emissionDate: new Date(),
      assignorId: uuidv4(),
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(payable);

    const result = await controller.getPayable(payableId);
    expect(result).toEqual(payable);
    expect(service.findOne).toHaveBeenCalledWith(payableId);
  });

  it('should throw NotFoundException if payable not found', async () => {
    const payableId = 'non-existent-id';
    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    await expect(controller.getPayable(payableId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
