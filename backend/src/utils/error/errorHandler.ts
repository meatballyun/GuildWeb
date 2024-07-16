import { NODE_ENV } from '../../config';
import { TypedRequest } from '../../types/TypedRequest';
import { CommonError } from './commonError';
import { Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: TypedRequest, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'Error';
  err.message = (NODE_ENV === 'development' ? err.message : CommonError[err.statusCode]?.message) || 'Error';

  if (NODE_ENV === 'development') {
    console.log(err.stack);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    data: err.status,
  });
};
