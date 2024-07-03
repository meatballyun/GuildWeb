import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { userInfoService } from '../../services';

export class UserInfoController {
  static async getUserInfo(req: TypedRequest<never, never, never>, res: Response, next: NextFunction) {
    console.log('req.userId as number: ', req.userId as number);
    const user = await userInfoService.getOne(req.userId as number);
    return res.status(200).json({ data: user });
  }

  static async updateUserInfo(req: TypedRequest<never, never, never>, res: Response, next: NextFunction) {
    await userInfoService.update(req.userId as number, req.body);
    return res.status(200).json({ data: 'OK' });
  }
}
