import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { MemberService } from '../../services/guild/member';
import { NotificationService } from '../../services/notification/notification';
import { UserInfoService } from '../../services/user/userInfo';
import { ApplicationError } from '../../utils/error/applicationError';

export class memberController {
  static async replyInvitation(req: TypedRequest, res: Response, next: NextFunction) {
    await MemberService.replyInvitation(req.session.passport.user, req.params.gid);
    await UserInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async getMembers(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await MemberService.getAll(req.params.gid);
    return res.status(200).json({ data });
  }

  static async sendInvitation(req: TypedRequest, res: Response, next: NextFunction) {
    await MemberService.sendInvitation(req.body.uid, req.params.gid);
    req.body.senderId = req.params.gid;
    req.body.recipientId = req.body.uid;
    req.body.type = 'Guild';
    await NotificationService.create(req.body);
    await UserInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async updateMember(req: TypedRequest, res: Response, next: NextFunction) {
    await MemberService.update(req.params, req.body.membership);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteMember(req: TypedRequest, res: Response, next: NextFunction) {
    if (!req?.member) throw new ApplicationError(403);
    await MemberService.delete(req.params, req.session.passport.user, req.member.membership);
    await UserInfoService.updateExp(req.params.uid, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
