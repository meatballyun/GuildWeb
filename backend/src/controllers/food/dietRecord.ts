import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { dietRecordService } from '../../services/food';
import { userInfoService } from '../../services/user';

export class DietRecordController {
  static async getDietRecords(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await dietRecordService.getAll(req.query.date, req.userId as number);
    return res.status(200).json({ data });
  }

  static async createDietRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await dietRecordService.create(req.body, req.userId as number);
    await userInfoService.updateExp(req.userId as number, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteDietRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await dietRecordService.remove(req.params.id, req.userId as number);
    await userInfoService.updateExp(req.userId as number, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
