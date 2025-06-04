import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils/password/hash';
import { UserRepository } from './user.repository';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../common/exceptions/user.exceptions';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<string> {
    await this.ensureUserNotExists(dto.email);

    const { password, ...userData } = dto;
    const hashedPassword = await hashPassword(password);

    await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return `User "${dto.name}" created successfully`;
  }

  async ensureUserNotExists(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) throw new UserAlreadyExistsException(email);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UserNotFoundException(email);
    return user;
  }
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundException(`ID: ${id}`);
    return user;
  }
}
