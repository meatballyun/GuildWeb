import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { MemberRepository } from '../../repositories/guild/member.repository';
import { NotificationRepository } from '../../repositories/notification/notification.repository';
import { UserInfoRepository } from '../../repositories/user/userInfo.repository';
import { ApplicationError } from '../../utils/error/applicationError';

export class memberController {
  static async replyInvitation(req: TypedRequest, res: Response, next: NextFunction) {
    await MemberRepository.replyInvitation(req.session.passport.user, req.params.gid);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async getMembers(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await MemberRepository.getAll(req.params.gid);
    return res.status(200).json({ data });
  }

  static async sendInvitation(req: TypedRequest, res: Response, next: NextFunction) {
    await MemberRepository.sendInvitation(req.body.uid, req.params.gid);
    req.body.senderId = req.params.gid;
    req.body.recipientId = req.body.uid;
    req.body.type = 'Guild';
    await NotificationRepository.create(req.body);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async updateMember(req: TypedRequest, res: Response, next: NextFunction) {
    await MemberRepository.update(req.params, req.body.membership);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteMember(req: TypedRequest, res: Response, next: NextFunction) {
    if (!req?.member) throw new ApplicationError(403);
    await MemberRepository.delete(req.params, req.session.passport.user, req.member.membership);
    await UserInfoRepository.updateExp(req.params.uid, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
