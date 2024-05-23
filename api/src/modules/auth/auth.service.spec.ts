import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT } from '../../common/constants';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const result = await service.validateUser(
        ENVIRONMENT.USERNAME,
        ENVIRONMENT.USERNAME,
      );
      expect(result).toEqual({ login: ENVIRONMENT.USERNAME });
    });

    it('should return null if credentials are invalid', async () => {
      const result = await service.validateUser('wrong', 'credentials');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { login: ENVIRONMENT.USERNAME };
      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'access_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        login: ENVIRONMENT.USERNAME,
      });
    });
  });
});
