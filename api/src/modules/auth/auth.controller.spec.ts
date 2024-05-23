import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AssignorService } from '../assignor/assignor.service';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn().mockReturnValue({ access_token: 'access_token' }),
          },
        },
        {
          provide: AssignorService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      const mockedUser: User = {
        username: 'aprovame',
        id: uuidv4(),
        password: 'saosajdosaj',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockedUser);

      const result = await controller.login({
        login: 'aprovame',
        password: 'aprovame',
      });
      expect(result).toEqual({ access_token: 'access_token' });
      expect(service.validateUser).toHaveBeenCalledWith('aprovame', 'aprovame');
      expect(service.login).toHaveBeenCalledWith(mockedUser);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        controller.login({ login: 'wrong', password: 'credentials' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
