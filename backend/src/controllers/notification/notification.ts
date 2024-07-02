import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { notificationService } from '../../services/notification';

export class NotificationController {
  static async getNotifications(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await notificationService.getAll(req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getNotificationDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await notificationService.getOne(req.params.nid);
    await notificationService.read(req.params.nid);
    return res.status(200).json({ data });
  }

  static async uesNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await notificationService.use(req.params.nid);
    return res.status(200).json({ data: 'OK' });
  }

  static async createNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await notificationService.create(req.body);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await notificationService.remove(req.params.nid);
    return res.status(200).json({ data: 'OK' });
  }
}
