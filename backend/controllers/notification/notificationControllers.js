const NotificationRepository =
  new (require('../../repositories/notification/notification.repository.js'))();

class NotificationController {
  async getNotifications(req, res, next) {
    const data = await NotificationRepository.getAll(req.session.passport.user);
    return res.status(200).json({ data });
  }

  async getNotificationDetail(req, res, next) {
    const data = await NotificationRepository.getOne(req.params.nid);
    await NotificationRepository.read(req.params.nid);
    return res.status(200).json({ data });
  }

  async uesNotification(req, res, next) {
    const result = await NotificationRepository.use(req.params.nid);
    return res.status(200).json({ data: result });
  }

  async createNotification(req, res, next) {
    const result = await NotificationRepository.create(req.body);
    return res.status(200).json({ data: result });
  }

  async deleteNotification(req, res, next) {
    const result = await NotificationRepository.delete(req.params.nid);
    return res.status(200).json({ data: result });
  }
}

module.exports = NotificationController;
