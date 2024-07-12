import jwt from 'jsonwebtoken';
import { ApplicationError } from '../error/applicationError';
import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { Payload } from '../../types/common';

const verifyJwtToken = (token: string, secret: string) => {
  return new Promise<Payload>((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, secret);
      resolve(decoded as Payload);
    } catch (err) {
      reject(err);
    }
  });
};

export const verifyToken = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const jwtToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : false;
  if (!jwtToken) throw new ApplicationError(401);

  const secret = process.env.JWT_SECRET ?? '';
  try {
    const result = await verifyJwtToken(jwtToken, secret);
    if (!result?.email || !result) throw new ApplicationError(401);
    req.userId = result.userId;
  } catch (err) {
    throw new ApplicationError(401, err as any);
  }

  next();
};
