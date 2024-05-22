import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { CreatePayableDto } from './dtos/create-payable.dto';
import { v4 as uuidv4 } from 'uuid';

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
            getOne: jest.fn(),
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

    jest.spyOn(service, 'create').mockImplementation(() => {});

    const result = await controller.createPayable(createPayableDto);
    expect(result).toEqual(createPayableDto);
    expect(service.create).toHaveBeenCalledWith(createPayableDto);
  });
});
