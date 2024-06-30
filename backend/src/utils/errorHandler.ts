import { TypedRequest } from '../types/TypedRequest';
import { CommonError } from './error/commonError';
import { Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: TypedRequest, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'Error';
  err.message = (process.env.NODE_ENV === 'development' ? err.message : CommonError[err.statusCode]?.message) || 'Error';

  if (process.env.NODE_ENV === 'development') {
    console.log(err.stack);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    data: err.status,
  });
};
