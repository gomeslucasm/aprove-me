import { Test, TestingModule } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { NotFoundException } from '@nestjs/common';
import { Assignor } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

describe('AssignorController', () => {
  let controller: AssignorController;
  let service: AssignorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorController],
      providers: [
        {
          provide: AssignorService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AssignorController>(AssignorController);
    service = module.get<AssignorService>(AssignorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    jest.spyOn(service, 'findOne').mockResolvedValue(assignor);

    const result = await controller.getAssignor(assignorId);
    expect(result).toEqual(assignor);
    expect(service.findOne).toHaveBeenCalledWith(assignorId);
  });

  it('should throw NotFoundException if assignor not found', async () => {
    const assignorId = 'non-existent-id';
    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    await expect(controller.getAssignor(assignorId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
