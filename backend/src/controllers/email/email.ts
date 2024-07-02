import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { emailService } from '../../services/email';

export class MailController {
  static async sendSignUp(req: TypedRequest, res: Response, next: NextFunction) {
    await emailService.sendSignUp(req.body);
    return res.status(200).json({ data: 'OK' });
  }

  static async resendSignUp(req: TypedRequest, res: Response, next: NextFunction) {
    await emailService.resendSignUp(req.body.email);
    return res.status(200).json({ data: 'OK' });
  }

  static async sendResetPassword(req: TypedRequest, res: Response, next: NextFunction) {
    await emailService.sendResetPassword(req.body.email);
    return res.status(200).json({ data: 'OK' });
  }

  static async validationResetPassword(req: TypedRequest, res: Response, next: NextFunction) {
    await emailService.validationResetPassword(req.query);
    return res.status(200).json({ data: 'OK' });
  }

  static async validationSignUp(req: TypedRequest, res: Response, next: NextFunction) {
    await emailService.validationSignUp(req.query);
    return res.status(200).json({ data: 'OK' });
  }
}
