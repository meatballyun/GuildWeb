import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { notificationService } from '../../services/notification';

export const getNotifications = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await notificationService.getAll(req.userId as number);
  return res.status(200).json({ data });
};

export const getNotificationDetail = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await notificationService.getOne(req.params.nid);
  await notificationService.read(req.params.nid);
  return res.status(200).json({ data });
};

export const uesNotification = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await notificationService.use(req.params.nid);
  return res.status(200).json({ data: 'OK' });
};

export const createNotification = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await notificationService.create(req.body);
  return res.status(200).json({ data: 'OK' });
};

export const deleteNotification = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await notificationService.remove(req.params.nid);
  return res.status(200).json({ data: 'OK' });
};
