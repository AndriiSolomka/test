import { AppLoggerService } from '../logger.service';

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
};

jest.mock('../../utils/logger/logger.factory', () => ({
  createPinoLogger: () => mockLogger,
}));
jest.mock('../../utils/logger/logger.config', () => ({
  APP_LOG_FILE_PATH: '/dev/null',
}));

describe('AppLoggerService', () => {
  let service: AppLoggerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AppLoggerService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('log should call logger.info', () => {
    service.log('test log', 1, 2);
    expect(mockLogger.info).toHaveBeenCalledWith('test log', 1, 2);
  });

  it('error should call logger.error', () => {
    service.error('test error', 'details');
    expect(mockLogger.error).toHaveBeenCalledWith('test error', 'details');
  });

  it('warn should call logger.warn', () => {
    service.warn('test warn', { a: 1 });
    expect(mockLogger.warn).toHaveBeenCalledWith('test warn', { a: 1 });
  });

  it('debug should call logger.debug', () => {
    service.debug('test debug');
    expect(mockLogger.debug).toHaveBeenCalledWith('test debug');
  });

  it('verbose should call logger.trace', () => {
    service.verbose('test verbose');
    expect(mockLogger.trace).toHaveBeenCalledWith('test verbose');
  });
});
