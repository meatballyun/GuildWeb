import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import UserInfoRepository from '../../repositories/user/userInfo.repository';

class UserInfoController {
  static async getUserInfo(req: TypedRequest<never, never, never>, res: Response, next: NextFunction) {
    const user = await UserInfoRepository.getOne(req.session.passport?.user);
    return res.status(200).json({ data: user });
  }

  static async updateUserInfo(req: TypedRequest<never, never, never>, res: Response, next: NextFunction) {
    await UserInfoRepository.update(req.session.passport?.user, req.body);
    return res.status(200).json({ data: 'OK' });
  }
}

export default UserInfoController;
