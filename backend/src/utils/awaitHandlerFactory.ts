import { Request, Response, NextFunction } from 'express';

type MiddlewareFunctionType = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type FunctionType = (func: any) => MiddlewareFunctionType;

export const awaitHandlerFactory: FunctionType = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
