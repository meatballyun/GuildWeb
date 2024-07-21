import bcrypt from 'bcrypt';
import { ApplicationError } from '../utils/error/applicationError';
import { SALT } from '../config';

export const toHash = async (code: string) => {
  if (code && SALT) {
    code = await bcrypt.hash(code, parseInt(SALT));
    return code;
  }
  throw new ApplicationError(500);
};

export const comparer = async (password: string, code: string) => {
  bcrypt.compare(password, code, (err, result) => {
    if (err) return err;
    if (result) return true;
    return 'Invalid password';
  });
};
