import { UserEntity } from '../user.entity';
import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user?: UserEntity;
}
