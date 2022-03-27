import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { ExtendedRequest } from '../types/extended-request.interface';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExtendedRequest, res: Response, next: () => void) {
    if (!req.headers.authorization) {
      return null;
    }

    const [, token] = req.headers.authorization.split(' ');
    try {
      const decode: JwtPayload = verify(token, JWT_SECRET) as JwtPayload;
      const user = await this.userService.findById(decode.id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
