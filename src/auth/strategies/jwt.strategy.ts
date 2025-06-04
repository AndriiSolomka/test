import 'dotenv/config';
import { Request } from 'express';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return typeof req.cookies?.access_token === 'string'
            ? req.cookies.access_token
            : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: { user_id: number; sub: number }) {
    await this.userService.findOneById(payload.user_id);
    console.log(`Validating user: ${payload.user_id}`);
    return { user_id: payload.user_id };
  }
}
