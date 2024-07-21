import { Response, NextFunction } from 'express';
import { userInfoService, userListService } from '../../services';
import { TypedRequest } from '../../types/TypedRequest';

export const getUsers = async (req: TypedRequest<never, { q: string }, never>, res: Response, next: NextFunction) => {
  const data = await userListService.getAllUser(req.userId as number, req.query.q);
  return res.status(200).json({ data });
};

export const getFriends = async (req: TypedRequest<never, { q: string }, never>, res: Response, next: NextFunction) => {
  const data = await userListService.getAllFriend(req.userId as number, req.query.q);
  return res.status(200).json({ data });
};

export const sendFriendInvitation = async (req: TypedRequest<{ uid: number; type: string; senderId: number; recipientId: number }, never, never>, res: Response, next: NextFunction) => {
  await userListService.sendInvitation(req.userId as number, req.body.uid);
  req.body.type = 'user';
  req.body.senderId = req.userId as number;
  req.body.recipientId = req.body.uid;
  next();
};

export const updateFriend = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await userListService.update(req.userId as number, req.params.uid, req.body.status);
  return res.status(200).json({ data: 'OK' });
};

export const deleteFriend = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await userListService.remove(req.params.uid, req.userId as number);
  await userInfoService.updateExp(req.userId as number, -1);
  return res.status(200).json({ data: 'OK' });
};
