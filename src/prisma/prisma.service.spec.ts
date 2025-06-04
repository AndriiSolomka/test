/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { AppLoggerService } from '../logger/logger.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let logger: { error: jest.Mock; log: jest.Mock };

  beforeEach(async () => {
    logger = {
      error: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        { provide: AppLoggerService, useValue: logger },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect successfully', async () => {
      service.$connect = jest.fn().mockResolvedValue(undefined);
      await expect(service.onModuleInit()).resolves.toBeUndefined();
      expect(service.$connect).toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should log error and exit if connection fails', async () => {
      const error = new Error('fail');
      service.$connect = jest.fn().mockRejectedValue(error);
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      await expect(service.onModuleInit()).rejects.toThrow(
        'process.exit called',
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Database connection failed',
        error,
      );
      exitSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect and log', async () => {
      service.$disconnect = jest.fn().mockResolvedValue(undefined);
      await service.onModuleDestroy();
      expect(service.$disconnect).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Disconnected from the database');
    });
  });
});
