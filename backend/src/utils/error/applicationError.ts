import { CommonError } from './commonError';

type StatusCode = keyof typeof CommonError;

export class ApplicationError extends Error {
  public statusCode;
  public status;
  public message;
  public isOperational;

  constructor(statusCode: StatusCode, message?: string) {
    super();
    this.statusCode = statusCode ?? 500;
    this.status = CommonError[this.statusCode].status;
    this.message = message ?? CommonError[this.statusCode].message;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
