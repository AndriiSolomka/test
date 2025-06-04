import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../../common/exceptions/user.exceptions';
import { hashPassword } from '../../utils/password/hash';

jest.mock('../../utils/password/hash', () => ({
  hashPassword: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: {
    create: jest.Mock;
    findByEmail: jest.Mock;
    findById: jest.Mock;
  };

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return success message', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashed');
      userRepository.create.mockResolvedValue({});

      const dto = { email: 'a@mail.com', password: '123', name: 'Test' };
      const result = await service.create(dto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith('a@mail.com');
      expect(hashPassword).toHaveBeenCalledWith('123');
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'a@mail.com',
        name: 'Test',
        password: 'hashed',
      });
      expect(result).toBe('User "Test" created successfully');
    });

    it('should throw if user already exists', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1 });
      const dto = { email: 'a@mail.com', password: '123', name: 'Test' };
      await expect(service.create(dto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
    });
  });

  describe('ensureUserNotExists', () => {
    it('should throw if user exists', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: 1 });
      await expect(service.ensureUserNotExists('a@mail.com')).rejects.toThrow(
        UserAlreadyExistsException,
      );
    });

    it('should not throw if user does not exist', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      await expect(
        service.ensureUserNotExists('a@mail.com'),
      ).resolves.toBeUndefined();
    });
  });

  describe('findOneByEmail', () => {
    it('should return user if found', async () => {
      const user = { id: 1, email: 'a@mail.com' };
      userRepository.findByEmail.mockResolvedValue(user);
      const result = await service.findOneByEmail('a@mail.com');
      expect(result).toBe(user);
    });

    it('should throw if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      await expect(service.findOneByEmail('a@mail.com')).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return user if found', async () => {
      const user = { id: 1, email: 'a@mail.com' };
      userRepository.findById.mockResolvedValue(user);
      const result = await service.findOneById(1);
      expect(result).toBe(user);
    });

    it('should throw if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(service.findOneById(1)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
});
