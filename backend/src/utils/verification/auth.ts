import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { ApplicationError } from '../error/applicationError';

const authenticated = (req: TypedRequest, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  return next(new ApplicationError(401));
};

export default authenticated;
