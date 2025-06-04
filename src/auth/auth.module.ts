import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { CustomJwtModule } from '../custom-jwt/custom-jwt.module';
import { AuthController } from './auth.controller';
import { CookieModule } from '../cookie/cookie.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UserModule, CustomJwtModule, CookieModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
