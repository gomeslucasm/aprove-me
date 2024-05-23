import { Test, TestingModule } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { CreateAssignorDto } from './dtos/create-assignor.dto';
import { UpdateAssignorDto } from './dtos/update-assignor.dto';
import { Assignor } from '@prisma/client';

describe('AssignorController', () => {
  let controller: AssignorController;
  let service: AssignorService;

  const mockAssignorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorController],
      providers: [{ provide: AssignorService, useValue: mockAssignorService }],
    }).compile();

    controller = module.get<AssignorController>(AssignorController);
    service = module.get<AssignorService>(AssignorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an assignor', async () => {
    const createAssignorDto: CreateAssignorDto = {
      id: 'uuid-assignor',
      document: '12345678901',
      email: 'test@example.com',
      phone: '1234567890',
      name: 'Test Assignor',
    };

    jest
      .spyOn(service, 'create')
      .mockResolvedValue(createAssignorDto as Assignor);

    const result = await controller.createAssignor(createAssignorDto);
    expect(result).toEqual(createAssignorDto);
    expect(service.create).toHaveBeenCalledWith(createAssignorDto);
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

    jest.spyOn(service, 'findAll').mockResolvedValue(assignors);

    const result = await controller.findAll();
    expect(result).toEqual(assignors);
    expect(service.findAll).toHaveBeenCalled();
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

    jest.spyOn(service, 'findOne').mockResolvedValue(assignor);

    const result = await controller.getAssignor('uuid-assignor');
    expect(result).toEqual(assignor);
    expect(service.findOne).toHaveBeenCalledWith('uuid-assignor');
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

    jest.spyOn(service, 'update').mockResolvedValue(updatedAssignor);

    const result = await controller.updateAssignor(
      'uuid-assignor',
      updateAssignorDto,
    );
    expect(result).toEqual(updatedAssignor);
    expect(service.update).toHaveBeenCalledWith(
      'uuid-assignor',
      updateAssignorDto,
    );
  });

  it('should delete an assignor', async () => {
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

    jest.spyOn(service, 'softDelete').mockResolvedValue(deletedAssignor);

    const result = await controller.deleteAssignor('uuid-assignor');
    expect(result).toEqual(deletedAssignor);
    expect(service.softDelete).toHaveBeenCalledWith('uuid-assignor');
  });
});
