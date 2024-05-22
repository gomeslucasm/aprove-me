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
              findUnique: jest.fn(),
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

  it('should return an assignor by id', async () => {
    const assignorId = uuidv4();
    const assignor: Assignor = {
      id: assignorId,
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
    };

    jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(assignor);

    const result = await service.findOne(assignorId);
    expect(result).toEqual(assignor);
    expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
      where: { id: assignorId },
    });
  });

  it('should return null if assignor not found', async () => {
    jest.spyOn(prisma.assignor, 'findUnique').mockResolvedValue(null);

    const result = await service.findOne('non-existent-id');
    expect(result).toBeNull();
    expect(prisma.assignor.findUnique).toHaveBeenCalledWith({
      where: { id: 'non-existent-id' },
    });
  });
});
