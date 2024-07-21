import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { dietRecordService } from '../../services/food';
import { userInfoService } from '../../services/user';

export const getDietRecords = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await dietRecordService.getAll(req.query.date, req.userId as number);
  return res.status(200).json({ data });
};

export const createDietRecord = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await dietRecordService.create(req.body, req.userId as number);
  await userInfoService.updateExp(req.userId as number, 1);
  return res.status(200).json({ data: 'OK' });
};

export const deleteDietRecord = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await dietRecordService.remove(req.params.id, req.userId as number);
  await userInfoService.updateExp(req.userId as number, -1);
  return res.status(200).json({ data: 'OK' });
};
