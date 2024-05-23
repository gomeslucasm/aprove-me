import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException, ConflictException } from '@nestjs/common';
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
            update: jest.fn(),
            softDelete: jest.fn(),
            findAssignorByDocument: jest.fn(),
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
      assignorId: uuidv4(),
    };

    const createdPayable = {
      id: createPayableDto.id,
      value: createPayableDto.value,
      emissionDate: new Date(createPayableDto.emissionDate),
      assignorId: createPayableDto.assignorId,
      deletedAt: null,
    };

    jest.spyOn(service, 'create').mockResolvedValue(createdPayable);

    const result = await controller.createPayable(createPayableDto);
    expect(result).toEqual(createPayableDto);
    expect(service.create).toHaveBeenCalledWith(createPayableDto);
  });

  it('should throw ConflictException if assignor already exists', async () => {
    const createPayableDto: CreatePayableDto = {
      id: uuidv4(),
      value: 100.5,
      emissionDate: new Date().toISOString(),
      assignorId: 'existing-document',
    };

    const existingAssignor = {
      id: uuidv4(),
      document: 'existing-document',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      deletedAt: null,
    };

    jest
      .spyOn(service, 'findAssignorByDocument')
      .mockResolvedValue(existingAssignor);

    await expect(controller.createPayable(createPayableDto)).rejects.toThrow(
      ConflictException,
    );
    expect(service.findAssignorByDocument).toHaveBeenCalledWith(
      createPayableDto.assignorId,
    );
  });

  it('should return all payables', async () => {
    const payables: Payable[] = [
      {
        id: uuidv4(),
        value: 100.5,
        emissionDate: new Date(),
        assignorId: uuidv4(),
        deletedAt: null,
      },
      {
        id: uuidv4(),
        value: 200.75,
        emissionDate: new Date(),
        assignorId: uuidv4(),
        deletedAt: null,
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(payables);

    const result = await controller.findAll();
    expect(result).toEqual(payables);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a payable by id', async () => {
    const payableId = uuidv4();
    const payable: Payable = {
      id: payableId,
      value: 100.5,
      emissionDate: new Date(),
      assignorId: uuidv4(),
      deletedAt: null,
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

  it('should throw NotFoundException if payable not found when deleting', async () => {
    const payableId = 'non-existent-id';

    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    await expect(controller.softDeletePayable(payableId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
