import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = new Date().getTime();

    res.on('finish', () => {
      const endTime = new Date().getTime();

      this.logger.log(
        `${req.ip} ${req.method} ${res.statusCode}`,
        req.originalUrl,
        `${endTime - startTime}ms`,
      );
    });

    next();
  }
}
