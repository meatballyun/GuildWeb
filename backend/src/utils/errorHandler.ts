// @ts-nocheck
import CommonError from './error/commonError';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? 'Error';
  err.message =
    (process.env.NODE_ENV === 'development' ? err.message : CommonError[err.statusCode].MESSAGE) ||
    'Error';
  if (process.env.NODE_ENV === 'development') console.log(err.stack);

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    data: err.status,
  });
};
