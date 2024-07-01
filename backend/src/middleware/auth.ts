import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { TypedRequest } from '../types/TypedRequest';
import passport from '../utils/verification/passport';
import { toHash } from '../utils/hashCode';
import { ApplicationError } from '../utils/error/applicationError';
import { UserModel } from '../models/user/user';
import { ConfirmationEmailModel } from '../models/email/confirmationEmail';

export class AuthController {
  static async login(req: TypedRequest, res: Response, next: NextFunction) {
    passport.authenticate('login', async function (err: any, user: any, info: any) {
      try {
        if (err) throw new ApplicationError(500, err);
        if (!user) throw new ApplicationError(401, info);
        if (user.status !== 'confirmed') throw new ApplicationError(403);

        req.login(user, (err?: string) => {
          if (err) throw new ApplicationError(403, err);
          const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            iat: Math.floor(Date.now() / 1000),
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET ?? '', { expiresIn: '1d' });
          return res.status(200).json({ data: { token } });
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
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
