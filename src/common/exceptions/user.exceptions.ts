import { ConflictException, NotFoundException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`User with email "${email}" already exists`);
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(email: string) {
    super(`User with email "${email}" not found`);
  }
}
