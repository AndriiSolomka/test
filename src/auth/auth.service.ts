import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSafe } from '../constants/types/user/user.type';
import { UserService } from '../user/user.service';
import { validatePassword } from '../utils/password/hash';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login(user_id: number): { access_token: string } {
    const payload = { user_id, sub: user_id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(email: string, password: string): Promise<UserSafe> {
    const user = await this.userService.findOneByEmail(email);
    if (validatePassword(password, user.password)) {
      // you can choose to exclude the password field from the result
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
