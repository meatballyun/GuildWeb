import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { DietRecordService } from '../../services/food/dietRecord';
import { UserInfoService } from '../../services/user/userInfo';

export class DietRecordController {
  static async getDietRecords(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await DietRecordService.getAll(req.query.date, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async createDietRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await DietRecordService.create(req.body, req.session.passport.user);
    await UserInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteDietRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await DietRecordService.delete(req.params.id, req.session.passport.user);
    await UserInfoService.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
