import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { NotificationService } from '../../services/notification/notification';

export class NotificationController {
  static async getNotifications(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await NotificationService.getAll(req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getNotificationDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await NotificationService.getOne(req.params.nid);
    await NotificationService.read(req.params.nid);
    return res.status(200).json({ data });
  }

  static async uesNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await NotificationService.use(req.params.nid);
    return res.status(200).json({ data: 'OK' });
  }

  static async createNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await NotificationService.create(req.body);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await NotificationService.delete(req.params.nid);
    return res.status(200).json({ data: 'OK' });
  }
}
