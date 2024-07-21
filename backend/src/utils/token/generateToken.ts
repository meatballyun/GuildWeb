import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';

export const generateToken = async (userId: number, email: string) => {
  const payload = {
    userId: userId,
    email: email,
  };
  const secret = JWT_SECRET ?? '';
  const expiresTime = '7d';
  const options = {
    expiresIn: expiresTime,
  };

  const jwtToken = jwt.sign(payload, secret, options);

  return jwtToken;
};
