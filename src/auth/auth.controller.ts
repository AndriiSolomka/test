import { Controller, Request, Post, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CookieService } from '../cookie/cookie.service';
import { LocalAuthGuard } from '../common/guards/auth/local-auth.guard';
import { AuthRequest } from '../constants/interfaces/auth/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): { message: string } {
    const { access_token } = this.authService.login(req.user.id);
    this.cookieService.setUserCookie(res, access_token);
    return { message: 'Logged in successfully' };
  }
}
