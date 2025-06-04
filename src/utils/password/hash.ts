import * as bcrypt from 'bcrypt';
import { SALT } from '../../constants/enum/password/password.enum';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT.ROUNDS);
}

export function validatePassword(
  plainPassword: string,
  hashedPassword: string,
): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}
