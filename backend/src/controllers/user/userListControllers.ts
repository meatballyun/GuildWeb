import { Response, NextFunction } from 'express';
import { UserListRepository } from '../../repositories/user/userList.repository';
import { UserInfoRepository } from '../../repositories/user/userInfo.repository';
import { TypedRequest } from '../../types/TypedRequest';

type Status = 'confirmed' | 'pending' | 'blocked';

export class UserListController {
  static async getUsers(req: TypedRequest<never, { q: string }, never>, res: Response, next: NextFunction) {
    const data = await UserListRepository.getAllUser(req.session.passport.user, req.query.q);
    return res.status(200).json({ data });
  }

  static async getFriends(req: TypedRequest<never, { q: string }, never>, res: Response, next: NextFunction) {
    const data = await UserListRepository.getAllFriend(req.session.passport.user, req.query.q);
    return res.status(200).json({ data });
  }

  static async sendInvitation(req: TypedRequest<{ uid: number; type: string; senderId: number; recipientId: number }, never, never>, res: Response, next: NextFunction) {
    await UserListRepository.sendInvitation(req.session.passport.user, req.body.uid);
    req.body.type = 'User';
    req.body.senderId = req.session.passport.user;
    req.body.recipientId = req.body.uid;
    next();
  }

  static async updateFriend(req: TypedRequest<{ status: Status }, never, { uid: number }>, res: Response, next: NextFunction) {
    await UserListRepository.update(req.session.passport.user, req.params.uid, req.body.status);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteFriend(req: TypedRequest<never, never, { uid: number }>, res: Response, next: NextFunction) {
    await UserListRepository.delete(req.params.uid, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
