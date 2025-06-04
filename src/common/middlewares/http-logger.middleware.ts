import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logHttpRequest } from '../../utils/logger/http-logger';
import { HTTP_LOG_FILE_PATH } from '../../utils/logger/logger.config';
import { createPinoLogger } from '../../utils/logger/logger.factory';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = createPinoLogger(HTTP_LOG_FILE_PATH, true);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      logHttpRequest(req, res, start, this.logger);
    });

    next();
  }
}
