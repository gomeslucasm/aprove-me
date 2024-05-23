import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test_token'),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const user = {
        username: 'aprovame',
        password: await bcrypt.hash('aprovame', 10),
      };

      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('aprovame', 'aprovame');
      expect(result).toEqual({ username: 'aprovame' });
    });

    it('should return null if credentials are invalid', async () => {
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);

      const result = await service.validateUser('wrong', 'credentials');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { login: 'username' };
      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'test_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ username: 'username' });
    });
  });
});
