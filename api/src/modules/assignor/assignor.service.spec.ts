import { Test, TestingModule } from '@nestjs/testing';
import { AssignorService } from './assignor.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAssignorDto } from './dtos/create-assignor.dto';
import { UpdateAssignorDto } from './dtos/update-assignor.dto';
import { Assignor } from '@prisma/client';
import { REQUEST } from '@nestjs/core';
import { RequestWithUser } from '../../common/interfaces/request.interface';

describe('AssignorService', () => {
  let service: AssignorService;
  let prisma: PrismaService;

  const mockRequest: RequestWithUser = {
    user: {
      userId: 'uuid-user',
      username: 'testuser',
      assignorId: 'uuid-assignor',
    },
    cookies: {},
  } as unknown as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        PrismaService,
        { provide: REQUEST, useValue: mockRequest },
      ],
    }).compile();

    service = module.get<AssignorService>(AssignorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an assignor', async () => {
    const createAssignorDto: CreateAssignorDto = {
      id: 'uuid-assignor',
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
    };

    const createdAssignor: Assignor = {
      ...createAssignorDto,
      userId: 'uuid-user',
      deletedAt: null,
    };

    jest.spyOn(prisma.assignor, 'create').mockResolvedValue(createdAssignor);

    const result = await service.create(createAssignorDto);
    expect(result).toEqual(createdAssignor);
    expect(prisma.assignor.create).toHaveBeenCalledWith({
      data: {
        ...createAssignorDto,
        userId: 'uuid-user',
      },
    });
  });

  it('should find all assignors', async () => {
    const assignors: Assignor[] = [
      {
        id: 'uuid-assignor',
        document: '12345678901',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test Assignor',
        userId: 'uuid-user',
        deletedAt: null,
      },
    ];

    jest.spyOn(prisma.assignor, 'findMany').mockResolvedValue(assignors);

    const result = await service.findAll();
    expect(result).toEqual(assignors);
    expect(prisma.assignor.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'uuid-user',
        deletedAt: null,
      },
    });
  });

  it('should find one assignor', async () => {
    const assignor: Assignor = {
      id: 'uuid-assignor',
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      userId: 'uuid-user',
      deletedAt: null,
    };

    jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(assignor);

    const result = await service.findOne('uuid-assignor');
    expect(result).toEqual(assignor);
    expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'uuid-assignor',
        deletedAt: null,
      },
    });
  });

  it('should update an assignor', async () => {
    const updateAssignorDto: UpdateAssignorDto = {
      document: '98765432100',
      email: 'updated@example.com',
      phone: '0987654321',
      name: 'Updated Assignor',
    };

    const updatedAssignor: Assignor = {
      id: 'uuid-assignor',
      document: updateAssignorDto.document,
      email: updateAssignorDto.email,
      phone: updateAssignorDto.phone,
      name: updateAssignorDto.name,
      userId: 'uuid-user',
      deletedAt: null,
    };

    jest.spyOn(prisma.assignor, 'update').mockResolvedValue(updatedAssignor);

    const result = await service.update('uuid-assignor', updateAssignorDto);
    expect(result).toEqual(updatedAssignor);
    expect(prisma.assignor.update).toHaveBeenCalledWith({
      where: {
        id: 'uuid-assignor',
        userId: 'uuid-user',
        deletedAt: null,
      },
      data: updateAssignorDto,
    });
  });

  it('should soft delete an assignor', async () => {
    const assignor: Assignor = {
      id: 'uuid-assignor',
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      userId: 'uuid-user',
      deletedAt: null,
    };

    const deletedAssignor: Assignor = {
      ...assignor,
      deletedAt: new Date(),
    };

    jest.spyOn(prisma.assignor, 'update').mockResolvedValue(deletedAssignor);

    const result = await service.softDelete('uuid-assignor');
    expect(result).toEqual(deletedAssignor);
    expect(prisma.assignor.update).toHaveBeenCalledWith({
      where: {
        id: 'uuid-assignor',
        userId: 'uuid-user',
        deletedAt: null,
      },
      data: {
        deletedAt: expect.any(Date),
      },
    });
  });
});
