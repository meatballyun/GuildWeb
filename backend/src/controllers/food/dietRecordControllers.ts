import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { DietRecordRepository } from '../../repositories/food/dietRecord.repository';
import { UserInfoRepository } from '../../repositories/user/userInfo.repository';

export class DietRecordController {
  static async getDietRecords(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await DietRecordRepository.getAll(req.query.date, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async createDietRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await DietRecordRepository.create(req.body, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteDietRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await DietRecordRepository.delete(req.params.id, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
