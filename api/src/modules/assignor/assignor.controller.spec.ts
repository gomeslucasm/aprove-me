import { Test, TestingModule } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { CreateAssignorDto } from './dtos/create-assignor.dto';
import { UpdateAssignorDto } from './dtos/update-assignor.dto';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { Assignor } from '@prisma/client';

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
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
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

  it('should create an assignor', async () => {
    const createAssignorDto: CreateAssignorDto = {
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

    jest.spyOn(service, 'create').mockResolvedValue(createdAssignor);

    const result = await controller.createAssignor(createAssignorDto);
    expect(result).toEqual(createAssignorDto);
    expect(service.create).toHaveBeenCalledWith(createAssignorDto);
  });

  it('should return all assignors', async () => {
    const assignors: Assignor[] = [
      {
        id: uuidv4(),
        document: '12345678901',
        email: 'test1@example.com',
        phone: '1234567890',
        name: 'Test Assignor 1',
        deletedAt: null,
      },
      {
        id: uuidv4(),
        document: '98765432100',
        email: 'test2@example.com',
        phone: '0987654321',
        name: 'Test Assignor 2',
        deletedAt: null,
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(assignors);

    const result = await controller.findAll();
    expect(result).toEqual(assignors);
    expect(service.findAll).toHaveBeenCalled();
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

  it('should update an assignor', async () => {
    const assignorId = uuidv4();
    const updateAssignorDto: UpdateAssignorDto = {
      email: 'updated@example.com',
    };

    const assignor: Assignor = {
      id: assignorId,
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      deletedAt: null,
    };

    const updatedAssignor: Assignor = {
      ...assignor,
      email: 'updated@example.com',
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(assignor);
    jest.spyOn(service, 'update').mockResolvedValue(updatedAssignor);

    const result = await controller.updateAssignor(
      assignorId,
      updateAssignorDto,
    );
    expect(result).toEqual(updatedAssignor);
    expect(service.findOne).toHaveBeenCalledWith(assignorId);
    expect(service.update).toHaveBeenCalledWith(assignorId, updateAssignorDto);
  });

  it('should throw NotFoundException if assignor not found when updating', async () => {
    const assignorId = 'non-existent-id';
    const updateAssignorDto: UpdateAssignorDto = {
      email: 'updated@example.com',
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    await expect(
      controller.updateAssignor(assignorId, updateAssignorDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should soft delete an assignor', async () => {
    const assignorId = uuidv4();
    const assignor: Assignor = {
      id: assignorId,
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
      deletedAt: null,
    };

    const softDeletedAssignor: Assignor = {
      ...assignor,
      deletedAt: new Date(),
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(assignor);
    jest.spyOn(service, 'softDelete').mockResolvedValue(softDeletedAssignor);

    const result = await controller.deleteAssignor(assignorId);
    expect(result.deletedAt).toBeDefined();
    expect(service.findOne).toHaveBeenCalledWith(assignorId);
    expect(service.softDelete).toHaveBeenCalledWith(assignorId);
  });

  it('should throw NotFoundException if assignor not found when deleting', async () => {
    const assignorId = 'non-existent-id';

    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    await expect(controller.deleteAssignor(assignorId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
