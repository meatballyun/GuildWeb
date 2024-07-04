import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { memberService } from '../../services/guild';
import { notificationService } from '../../services/notification';
import { userInfoService } from '../../services/user';
import { ApplicationError } from '../../utils/error/applicationError';

export const replyInvitation = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await memberService.replyInvitation(req.userId as number, req.params.gid);
  await userInfoService.updateExp(req.userId as number, 1);
  return res.status(200).json({ data: 'OK' });
};

export const getMembers = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await memberService.getAll(req.params.gid);
  return res.status(200).json({ data });
};

export const sendGuildInvitation = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await memberService.sendInvitation(req.body.uid, req.params.gid);
  req.body.senderId = req.params.gid;
  req.body.recipientId = req.body.uid;
  req.body.type = 'Guild';
  await notificationService.create(req.body);
  await userInfoService.updateExp(req.userId as number, 1);
  return res.status(200).json({ data: 'OK' });
};

export const updateMember = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await memberService.update(req.params, req.body.membership);
  return res.status(200).json({ data: 'OK' });
};

export const deleteMember = async (req: TypedRequest, res: Response, next: NextFunction) => {
  if (!req?.member) throw new ApplicationError(403);
  await memberService.remove(req.params, req.userId as number, req.member.membership);
  await userInfoService.updateExp(req.params.uid, -1);
  return res.status(200).json({ data: 'OK' });
};
