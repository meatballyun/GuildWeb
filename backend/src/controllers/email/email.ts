import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { emailService } from '../../services/email';

export const sendSignUp = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await emailService.sendSignUp(req.body);
  return res.status(200).json({ data: 'OK' });
};

export const resendSignUp = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await emailService.resendSignUp(req.body.email);
  return res.status(200).json({ data: 'OK' });
};

export const sendResetPassword = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await emailService.sendResetPassword(req.body.email);
  return res.status(200).json({ data: 'OK' });
};

export const validationResetPassword = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await emailService.validationResetPassword(req.query);
  return res.status(200).json({ data: 'OK' });
};

export const validationSignUp = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await emailService.validationSignUp(req.query);
  return res.status(200).json({ data: 'OK' });
};
