/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: { create: jest.Mock };

  beforeEach(async () => {
    userService = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call userService.create with dto and return result', async () => {
      const dto: CreateUserDto = {
        email: 'test@mail.com',
        password: '123',
      } as any;
      const createdUser = { id: 1, ...dto };
      userService.create.mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdUser);
    });
  });
});
