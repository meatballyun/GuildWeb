import NotificationRepository from '../../repositories/notification/notification.repository';
import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';

class NotificationController {
  static async getNotifications(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await NotificationRepository.getAll(req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getNotificationDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await NotificationRepository.getOne(req.params.nid);
    await NotificationRepository.read(req.params.nid);
    return res.status(200).json({ data });
  }

  static async uesNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await NotificationRepository.use(req.params.nid);
    return res.status(200).json({ data: 'OK' });
  }

  static async createNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await NotificationRepository.create(req.body);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteNotification(req: TypedRequest, res: Response, next: NextFunction) {
    await NotificationRepository.delete(req.params.nid);
    return res.status(200).json({ data: 'OK' });
  }
}

export default NotificationController;
