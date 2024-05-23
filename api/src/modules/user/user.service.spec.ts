import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const hashedPassword = await bcrypt.hash(password, 10);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 'some-id',
        username,
        password: hashedPassword,
      });

      const result = await service.create(username, password);
      expect(result).toEqual({
        id: 'some-id',
        username,
        password: hashedPassword,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username,
          password: hashedPassword,
        },
      });
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';

      const user = {
        id: 'some-id',
        username,
        password: 'hashedpassword',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      const result = await service.findByUsername(username);
      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });
});
