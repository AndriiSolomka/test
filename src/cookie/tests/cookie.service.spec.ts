import { CookieService } from '../cookie.service';
import { Response } from 'express';

describe('CookieService', () => {
  let service: CookieService;
  let res: Partial<Response>;

  beforeEach(() => {
    service = new CookieService();
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setUserCookie', () => {
    it('should set cookie with access token', () => {
      service.setUserCookie(res as Response, 'token123');
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'token123',
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });
});
