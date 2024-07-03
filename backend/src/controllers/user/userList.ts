import { Response, NextFunction } from 'express';
import { userInfoService, userListService } from '../../services';
import { TypedRequest } from '../../types/TypedRequest';

type Status = 'confirmed' | 'pending' | 'blocked';

export class UserListController {
  static async getUsers(req: TypedRequest<never, { q: string }, never>, res: Response, next: NextFunction) {
    const data = await userListService.getAllUser(req.userId as number, req.query.q);
    return res.status(200).json({ data });
  }

  static async getFriends(req: TypedRequest<never, { q: string }, never>, res: Response, next: NextFunction) {
    const data = await userListService.getAllFriend(req.userId as number, req.query.q);
    return res.status(200).json({ data });
  }

  static async sendInvitation(req: TypedRequest<{ uid: number; type: string; senderId: number; recipientId: number }, never, never>, res: Response, next: NextFunction) {
    await userListService.sendInvitation(req.userId as number, req.body.uid);
    req.body.type = 'User';
    req.body.senderId = req.userId as number;
    req.body.recipientId = req.body.uid;
    next();
  }

  static async updateFriend(req: TypedRequest<{ status: Status }, never, { uid: number }>, res: Response, next: NextFunction) {
    await userListService.update(req.userId as number, req.params.uid, req.body.status);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteFriend(req: TypedRequest<never, never, { uid: number }>, res: Response, next: NextFunction) {
    await userListService.remove(req.params.uid, req.userId as number);
    await userInfoService.updateExp(req.userId as number, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
