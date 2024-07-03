import bcrypt from 'bcrypt';
import { Response, NextFunction } from 'express';
import { generateToken } from '../utils/generateToken';
import { TypedRequest } from '../types/TypedRequest';
import { toHash } from '../utils/hashCode';
import { ApplicationError } from '../utils/error/applicationError';
import { UserModel } from '../models';
import { ConfirmationEmailModel } from '../models/email/confirmationEmail';

const getJwtToken = async (userId: number, email: string) => {
  const expiresTime = '7d';
  const payload = {
    userId: userId,
    email: email,
  };
  const secret = process.env.JWT_SECRET ?? '';
  const options = {
    expiresIn: expiresTime,
  };
  const jwtToken = await generateToken(payload, secret, options);

  return jwtToken;
};
export class AuthController {
  static async login(req: TypedRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const user = await UserModel.getOneByEmail(email);
    if (!user) throw new ApplicationError(401, 'Email not found.');
    if (user?.status !== 'confirmed') throw new ApplicationError(403, 'Email is not yet verified');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new ApplicationError(401, 'Invalid password');

    const token = await getJwtToken(user.id, user.email);

    return res.status(200).json({ data: { token } });
  }

  static async signup(req: TypedRequest, res: Response, next: NextFunction) {
    const password = await toHash(req.body.password);
    const query = await UserModel.getOneByEmail(req.body.email);
    if (query) throw new ApplicationError(409);

    const result = await UserModel.create(req.body.name, req.body.email, password);
    if (!result) throw new ApplicationError(400);
    req.body.uid = result;
    next();
  }

  static async logout(req: TypedRequest, res: Response) {
    req.logout(() => {
      res.status(200).json({ data: 'Ok' });
    });
  }

  static async resetPassword(req: TypedRequest, res: Response, next: NextFunction) {
    const confirmationMail = await ConfirmationEmailModel.getLatestByUser(req.body.uid, 'forgotPassword');
    if (confirmationMail?.STATUS !== 'Confirmed' || new Date(confirmationMail.CREATE_TIME).valueOf() + 86400000 < new Date().valueOf()) return next(new ApplicationError(403));

    if (confirmationMail.CODE === req.body.code) {
      const password = await toHash(req.body.password);
      const query = await UserModel.updatePassword(req.body.uid, password);
      if (query) {
        return res.status(200).json({ data: 'OK' });
      } else {
        return next(new ApplicationError(404));
      }
    }
  }
}
