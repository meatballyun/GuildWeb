import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { ApplicationError } from '../error/applicationError';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const authenticated = (req: TypedRequest, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  return next(new ApplicationError(401));
};

export default authenticated;

interface Payload {
  userId: number;
  email: string;
}

export const generateToken = async (payload: Payload, secret: string, options: SignOptions) => {
  return new Promise((resolve, reject) => {
    const jwtToken = jwt.sign(payload, secret, options);
    resolve(jwtToken);
  });
};

export const verifyJwtToken = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, secret);
      resolve(decoded);
    } catch (error) {
      reject(error);
    }
  });
};
