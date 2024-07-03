import jwt, { SignOptions } from 'jsonwebtoken';
import { Payload } from '../types/common';

export const generateToken = async (payload: Payload, secret: string, options: SignOptions) => {
  return jwt.sign(payload, secret, options);
};
