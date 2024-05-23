import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from './payable.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { Payable, Assignor } from '@prisma/client';
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
              update: jest.fn(),
            },
            assignor: {
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
      value: 100.5,
      emissionDate: new Date().toISOString(),
      assignorId: uuidv4(),
    };

    const createdPayable: Payable = {
      ...createPayableDto,
      emissionDate: new Date(createPayableDto.emissionDate),
      deletedAt: null,
    };

    jest.spyOn(prisma.payable, 'create').mockResolvedValue(createdPayable);

    const result = await service.create(createPayableDto);
    expect(result).toEqual(createdPayable);
    expect(prisma.payable.create).toHaveBeenCalledWith({
      data: {
        id: createPayableDto.id,
        value: createPayableDto.value,
        emissionDate: new Date(createPayableDto.emissionDate),
        assignorId: createPayableDto.assignorId,
      },
    });
  });

  it('should find a payable by id', async () => {
    const payableId = uuidv4();
    const payable: Payable = {
      id: payableId,
      value: 100.5,
      emissionDate: new Date(),
      assignorId: uuidv4(),
      deletedAt: null,
    };

    jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(payable);

    const result = await service.findOne(payableId);
    expect(result).toEqual(payable);
    expect(prisma.payable.findUnique).toHaveBeenCalledWith({
      where: { id: payableId, deletedAt: null },
    });
  });

  it('should return null if payable not found', async () => {
    jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(null);

    const result = await service.findOne('non-existent-id');
    expect(result).toBeNull();
    expect(prisma.payable.findUnique).toHaveBeenCalledWith({
      where: { id: 'non-existent-id', deletedAt: null },
    });
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

    jest.spyOn(prisma.payable, 'findMany').mockResolvedValue(payables);

    const result = await service.findAll();
    expect(result).toEqual(payables);
    expect(prisma.payable.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
    });
  });

  it('should soft delete a payable', async () => {
    const payableId = uuidv4();
    const payable: Payable = {
      id: payableId,
      value: 100.5,
      emissionDate: new Date(),
      assignorId: uuidv4(),
      deletedAt: null,
    };

    const deleteDate = new Date();

    const softDeletedPayable: Payable = {
      ...payable,
      deletedAt: deleteDate,
    };

    jest.spyOn(prisma.payable, 'update').mockResolvedValue(softDeletedPayable);

    const result = await service.softDelete(payableId);
    expect(result).toEqual(softDeletedPayable);
    expect(prisma.payable.update).toHaveBeenCalledWith({
      where: { id: payableId, deletedAt: null },
      data: { deletedAt: deleteDate },
    });
  });

  it('should find an assignor by document', async () => {
    const document = '12345678901';
    const assignor: Assignor = {
      id: uuidv4(),
      document,
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      deletedAt: null,
    };

    jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(assignor);

    const result = await service.findAssignorByDocument(document);
    expect(result).toEqual(assignor);
    expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
      where: { document, deletedAt: null },
    });
  });

  it('should return null if assignor not found by document', async () => {
    const document = 'non-existent-document';

    jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(null);

    const result = await service.findAssignorByDocument(document);
    expect(result).toBeNull();
    expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
      where: { document, deletedAt: null },
    });
  });
});
