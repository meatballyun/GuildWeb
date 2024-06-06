import { Session } from 'express-session';
import { Request, Response, NextFunction } from 'express';
import UserInfoRepository from '../../repositories/user/userInfo.repository';

type Passport = {
  user: number;
};

interface Sess extends Session {
  passport?: Passport;
}

interface Req extends Request {
  session: Sess;
}

class UserInfoController {
  static async getUserInfo(req: Req, res: Response, next: NextFunction) {
    const user = await UserInfoRepository.getOne(req.session.passport?.user);
    return res.status(200).json({ data: user });
  }

  static async updateUserInfo(req: Req, res: Response, next: NextFunction) {
    await UserInfoRepository.update(req.session.passport?.user, req.body);
    return res.status(200).json({ data: 'OK' });
  }
}

export default UserInfoController;
