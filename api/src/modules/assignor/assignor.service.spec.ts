import { Test, TestingModule } from '@nestjs/testing';
import { AssignorService } from './assignor.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Assignor } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

describe('AssignorService', () => {
  let service: AssignorService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        {
          provide: PrismaService,
          useValue: {
            assignor: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AssignorService>(AssignorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an assignor', async () => {
    const createAssignorDto = {
      id: uuidv4(),
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
    };

    const createdAssignor = {
      ...createAssignorDto,
      deletedAt: null,
    };

    jest.spyOn(prisma.assignor, 'create').mockResolvedValue(createdAssignor);

    const result = await service.create(createAssignorDto);
    expect(result).toEqual(createdAssignor);
    expect(prisma.assignor.create).toHaveBeenCalledWith({
      data: createAssignorDto,
    });
  });

  it('should return an assignor by id', async () => {
    const assignorId = uuidv4();
    const assignor: Assignor = {
      id: assignorId,
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      deletedAt: null,
    };

    jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(assignor);

    const result = await service.findOne(assignorId);
    expect(result).toEqual(assignor);
    expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
      where: { id: assignorId, deletedAt: null },
    });
  });

  it('should return null if assignor not found', async () => {
    jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(null);

    const result = await service.findOne('non-existent-id');
    expect(result).toBeNull();
    expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
      where: { id: 'non-existent-id', deletedAt: null },
    });
  });

  it('should update an assignor', async () => {
    const assignorId = uuidv4();
    const updateAssignorDto = {
      email: 'updated@example.com',
    };

    const updatedAssignor: Assignor = {
      id: assignorId,
      document: '12345678901',
      email: 'updated@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      deletedAt: null,
    };

    jest.spyOn(prisma.assignor, 'update').mockResolvedValue(updatedAssignor);

    const result = await service.update(assignorId, updateAssignorDto);
    expect(result).toEqual(updatedAssignor);
    expect(prisma.assignor.update).toHaveBeenCalledWith({
      where: { id: assignorId, deletedAt: null },
      data: updateAssignorDto,
    });
  });

  it('should soft delete an assignor', async () => {
    const assignorId = uuidv4();

    const deletedDate = new Date();

    const softDeletedAssignor: Assignor = {
      id: assignorId,
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      deletedAt: new Date(),
    };

    jest
      .spyOn(prisma.assignor, 'update')
      .mockResolvedValue(softDeletedAssignor);

    const result = await service.softDelete(assignorId);
    expect(result).toEqual(softDeletedAssignor);
    expect(prisma.assignor.update).toHaveBeenCalledWith({
      where: { id: assignorId },
      data: { deletedAt: deletedDate },
    });
  });
});
