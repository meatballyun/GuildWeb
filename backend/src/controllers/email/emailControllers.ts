import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { EmailRepository } from '../../repositories/email/email.repository';

export class MailController {
  static async sendSignUp(req: TypedRequest, res: Response, next: NextFunction) {
    await EmailRepository.sendSignUp(req.body);
    return res.status(200).json({ data: 'OK' });
  }

  static async resendSignUp(req: TypedRequest, res: Response, next: NextFunction) {
    await EmailRepository.resendSignUp(req.body.email);
    return res.status(200).json({ data: 'OK' });
  }

  static async sendResetPassword(req: TypedRequest, res: Response, next: NextFunction) {
    await EmailRepository.sendResetPassword(req.body.email);
    return res.status(200).json({ data: 'OK' });
  }

  static async validationResetPassword(req: TypedRequest, res: Response, next: NextFunction) {
    await EmailRepository.validationResetPassword(req.query);
    return res.status(200).json({ data: 'OK' });
  }

  static async validationSignUp(req: TypedRequest, res: Response, next: NextFunction) {
    await EmailRepository.validationSignUp(req.query);
    return res.status(200).json({ data: 'OK' });
  }
}
