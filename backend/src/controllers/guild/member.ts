import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { memberService } from '../../services/guild';
import { notificationService } from '../../services/notification';
import { userInfoService } from '../../services/user';
import { ApplicationError } from '../../utils/error/applicationError';

export class memberController {
  static async replyInvitation(req: TypedRequest, res: Response, next: NextFunction) {
    await memberService.replyInvitation(req.session.passport.user, req.params.gid);
    await userInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async getMembers(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await memberService.getAll(req.params.gid);
    return res.status(200).json({ data });
  }

  static async sendInvitation(req: TypedRequest, res: Response, next: NextFunction) {
    await memberService.sendInvitation(req.body.uid, req.params.gid);
    req.body.senderId = req.params.gid;
    req.body.recipientId = req.body.uid;
    req.body.type = 'Guild';
    await notificationService.create(req.body);
    await userInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async updateMember(req: TypedRequest, res: Response, next: NextFunction) {
    await memberService.update(req.params, req.body.membership);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteMember(req: TypedRequest, res: Response, next: NextFunction) {
    if (!req?.member) throw new ApplicationError(403);
    await memberService.remove(req.params, req.session.passport.user, req.member.membership);
    await userInfoService.updateExp(req.params.uid, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
