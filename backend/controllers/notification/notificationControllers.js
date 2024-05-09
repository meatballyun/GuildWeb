const NotificationRepository = require('../../repositories/notification/notification.repository.js');

class NotificationController {
  static async getNotifications(req, res, next) {
    const data = await NotificationRepository.getAll(req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getNotificationDetail(req, res, next) {
    const data = await NotificationRepository.getOne(req.params.nid);
    await NotificationRepository.read(req.params.nid);
    return res.status(200).json({ data });
  }

  static async uesNotification(req, res, next) {
    await NotificationRepository.use(req.params.nid);
    return res.status(200).json({ data: 'OK' });
  }

  static async createNotification(req, res, next) {
    await NotificationRepository.create(req.body);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteNotification(req, res, next) {
    await NotificationRepository.delete(req.params.nid);
    return res.status(200).json({ data: 'OK' });
  }
}

module.exports = NotificationController;
