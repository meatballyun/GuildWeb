import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { userInfoService } from '../../services';

export const login = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const token = await userInfoService.login(req.body);
  return res.status(200).json({ data: { token } });
};

export const signup = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const result = await userInfoService.login(req.body);
  req.body.uid = result;
  next();
};

export const resetPassword = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await userInfoService.resetPassword(req.userId as number, req.body);
  return res.status(200).json({ data: 'OK' });
};

export const getUserInfo = async (req: TypedRequest<never, never, never>, res: Response, next: NextFunction) => {
  const user = await userInfoService.getOne(req.userId as number);
  return res.status(200).json({ data: user });
};

export const updateUserInfo = async (req: TypedRequest<never, never, never>, res: Response, next: NextFunction) => {
  await userInfoService.update(req.userId as number, req.body);
  return res.status(200).json({ data: 'OK' });
};
