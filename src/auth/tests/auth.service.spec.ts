import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { validatePassword } from '../../utils/password/hash';

jest.mock('../../utils/password/hash', () => ({
  validatePassword: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: { findOneByEmail: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    userService = { findOneByEmail: jest.fn() };
    jwtService = { sign: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access_token', () => {
      jwtService.sign.mockReturnValue('signed-token');
      const result = service.login(123);
      expect(jwtService.sign).toHaveBeenCalledWith({ user_id: 123, sub: 123 });
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });

  describe('validateUser', () => {
    it('should return user without password if password is valid', async () => {
      const user = { id: 1, email: 'test@mail.com', password: 'hashed' };
      userService.findOneByEmail.mockResolvedValue(user);
      (validatePassword as jest.Mock).mockReturnValue(true);

      const result = await service.validateUser('test@mail.com', 'pass');
      expect(userService.findOneByEmail).toHaveBeenCalledWith('test@mail.com');
      expect(validatePassword).toHaveBeenCalledWith('pass', 'hashed');
      expect(result).toEqual({ id: 1, email: 'test@mail.com' });
    });

    it('should return null if password is invalid', async () => {
      const user = { id: 1, email: 'test@mail.com', password: 'hashed' };
      userService.findOneByEmail.mockResolvedValue(user);
      (validatePassword as jest.Mock).mockReturnValue(false);

      const result = await service.validateUser('test@mail.com', 'wrong');
      expect(result).toBeNull();
    });
  });
});
