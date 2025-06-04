/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CookieService } from '../../cookie/cookie.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let cookieService: CookieService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockCookieService = {
    setUserCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CookieService, useValue: mockCookieService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    cookieService = module.get<CookieService>(CookieService);

    jest.clearAllMocks();
    mockCookieService.setUserCookie.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with user id and set cookie, then return message', () => {
      const mockUser = { id: 1 };
      const mockReq: any = { user: mockUser };
      const mockRes: Partial<Response> = {};
      const access_token = 'token123';

      mockAuthService.login.mockReturnValue({ access_token });

      const result = controller.login(mockReq, mockRes as Response);

      expect(authService.login).toHaveBeenCalledWith(mockUser.id);
      expect(cookieService.setUserCookie).toHaveBeenCalledWith(
        mockRes,
        access_token,
      );
      expect(result).toEqual({ message: 'Logged in successfully' });
    });

    it('should throw if req.user is missing', () => {
      const mockReq: any = {};
      const mockRes: Partial<Response> = {};

      expect(() => controller.login(mockReq, mockRes as Response)).toThrow();
    });

    it('should throw if authService.login throws', () => {
      const mockUser = { id: 2 };
      const mockReq: any = { user: mockUser };
      const mockRes: Partial<Response> = {};

      mockAuthService.login.mockImplementation(() => {
        throw new Error('login error');
      });

      expect(() => controller.login(mockReq, mockRes as Response)).toThrow(
        'login error',
      );
    });

    it('should throw if cookieService.setUserCookie throws', () => {
      const mockUser = { id: 3 };
      const mockReq: any = { user: mockUser };
      const mockRes: Partial<Response> = {};
      const access_token = 'token456';

      mockAuthService.login.mockReturnValue({ access_token });
      mockCookieService.setUserCookie.mockImplementation(() => {
        throw new Error('cookie error');
      });

      expect(() => controller.login(mockReq, mockRes as Response)).toThrow(
        'cookie error',
      );
    });

    it('should work with different user ids', () => {
      const mockUser = { id: 42 };
      const mockReq: any = { user: mockUser };
      const mockRes: Partial<Response> = {};
      const access_token = 'tokenXYZ';

      mockAuthService.login.mockReturnValue({ access_token });

      const result = controller.login(mockReq, mockRes as Response);

      expect(authService.login).toHaveBeenCalledWith(42);
      expect(cookieService.setUserCookie).toHaveBeenCalledWith(
        mockRes,
        access_token,
      );
      expect(result).toEqual({ message: 'Logged in successfully' });
    });
  });
});
