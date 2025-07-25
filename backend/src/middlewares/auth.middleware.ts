import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService){}

  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];
    const expectedToken = this.configService.get<string>('DUMMY_TOKEN');

    if (auth === `Bearer ${expectedToken}`) {
      return next();
    }

    res.status(401).json({ message: 'Unauthorized' });
  }
}
