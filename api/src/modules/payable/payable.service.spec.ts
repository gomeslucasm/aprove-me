import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from './payable.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { Payable } from '@prisma/client';
import { REQUEST } from '@nestjs/core';
import { RequestWithUser } from '../../common/interfaces/request.interface';

describe('PayableService', () => {
  let service: PayableService;
  let prisma: PrismaService;

  const mockRequest: RequestWithUser = {
    user: {
      userId: 'uuid-user',
      username: 'testuser',
      assignorId: 'uuid-assignor',
    },
    cookies: {},
    // Adicione outras propriedades conforme necessário
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableService,
        PrismaService,
        { provide: REQUEST, useValue: mockRequest },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payable', async () => {
    const date = new Date();
    const createPayableDto: CreatePayableDto = {
      id: 'uuid-payable',
      value: 100.5,
      emissionDate: date.toISOString(),
    };

    const createdPayable: Payable = {
      ...createPayableDto,
      emissionDate: date,
      deletedAt: null,
      assignorId: 'uuid-assignor',
    };

    jest.spyOn(prisma.payable, 'create').mockResolvedValue(createdPayable);

    const result = await service.create(createPayableDto);
    expect(result).toEqual(createdPayable);
    /* expect(prisma.payable.create).toHaveBeenCalledWith({
      data: {
        ...createPayableDto,
        assignorId: 'uuid-assignor',
      },
    }); */
  });

  it('should find all payables', async () => {
    const payables: Payable[] = [
      {
        id: 'uuid-payable',
        value: 100.5,
        emissionDate: new Date(),
        assignorId: 'uuid-assignor',
        deletedAt: null,
      },
    ];

    jest.spyOn(prisma.payable, 'findMany').mockResolvedValue(payables);

    const result = await service.findAll();
    expect(result).toEqual(payables);
    expect(prisma.payable.findMany).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        assignorId: 'uuid-assignor',
      },
    });
  });

  it('should find one payable', async () => {
    const payable: Payable = {
      id: 'uuid-payable',
      value: 100.5,
      emissionDate: new Date(),
      assignorId: 'uuid-assignor',
      deletedAt: null,
    };

    jest.spyOn(prisma.payable, 'findUnique').mockResolvedValue(payable);

    const result = await service.findOne('uuid-payable');
    expect(result).toEqual(payable);
    expect(prisma.payable.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'uuid-payable',
        assignorId: 'uuid-assignor',
        deletedAt: null,
      },
    });
  });

  it('should soft delete a payable', async () => {
    const payable: Payable = {
      id: 'uuid-payable',
      value: 100.5,
      emissionDate: new Date(),
      assignorId: 'uuid-assignor',
      deletedAt: null,
    };

    const deletedPayable: Payable = {
      ...payable,
      deletedAt: new Date(),
    };

    jest.spyOn(prisma.payable, 'update').mockResolvedValue(deletedPayable);

    const result = await service.softDelete('uuid-payable');
    expect(result).toEqual(deletedPayable);
    expect(prisma.payable.update).toHaveBeenCalledWith({
      where: {
        id: 'uuid-payable',
        assignorId: 'uuid-assignor',
        deletedAt: null,
      },
      data: {
        deletedAt: expect.any(Date),
      },
    });
  });
});
