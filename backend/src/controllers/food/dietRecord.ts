import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { dietRecordService } from '../../services/food';
import { userInfoService } from '../../services/user';

export class DietRecordController {
  static async getDietRecords(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await dietRecordService.getAll(req.query.date, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async createDietRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await dietRecordService.create(req.body, req.session.passport.user);
    await userInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteDietRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await dietRecordService.remove(req.params.id, req.session.passport.user);
    await userInfoService.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
