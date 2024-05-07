const ApplicationError = require('../../utils/error/applicationError.js');
const Guild = require('../../models/guild/guild.model.js');
const Notification = require('../../models/notification/notification.model.js');
const DEFAULT_NOTIFICATION_CONTENT = require('./default_notification_template.js');
const User = require('../../models/userModel.js');

class NotificationController {
  async getNotifications(req, res, next) {
    const notifications = await Notification.getAll(req.session.passport.user);
    let data;
    if (notifications && notifications?.length) {
      data = await Promise.all(
        notifications.map(async (row) => {
          let sender;
          if (row.TYPE === 'Guild') {
            const [query] = await Guild.getGuild(row.SENDER_ID);
            if (query) {
              sender = {
                id: query.ID,
                name: query.NAME,
                imageUrl: query.IMAGE_URL,
              };
            } else return next(new ApplicationError(409));
          } else if (row.TYPE === 'User') {
            const [query] = await User.getOneById(row.SENDER_ID);
            if (query) {
              sender = {
                id: query.ID,
                name: query.NAME,
                imageUrl: query.IMAGE_URL,
              };
            } else return next(new ApplicationError(409));
          }

          return {
            id: row.ID,
            createTime: row.CREATE_TIME,
            sender: sender,
            title: row.TITLE,
            read: row.READ,
            type: row.TYPE,
          };
        })
      );
    }
    return res.status(200).json({ data: data });
  }

  async getNotificationDetail(req, res, next) {
    const [notification] = await Notification.getOne(req.params.nid);
    if (notification) {
      let sender;
      if (notification.TYPE === 'Guild') {
        const [query] = await Guild.getGuild(notification.SENDER_ID);
        if (query) {
          sender = {
            id: query.ID,
            name: query.NAME,
            imageUrl: query.IMAGE_URL,
          };
        } else return next(new ApplicationError(409));
      } else if (notification.TYPE === 'User') {
        const [query] = await User.getOneById(notification.SENDER_ID);
        if (query) {
          sender = {
            id: query.ID,
            name: query.NAME,
            imageUrl: query.IMAGE_URL,
          };
        } else return next(new ApplicationError(409));
      }
      await Notification.read(req.params.nid);

      return res.status(200).json({
        success: true,
        message: 'Data retrieval successful.',
        data: {
          id: notification.ID,
          createTime: notification.CREATE_TIME,
          used: notification.USED,
          sender: sender,
          title: notification.TITLE,
          description: notification.DESCRIPTION,
          type: notification.TYPE,
        },
      });
    }
    return next(new ApplicationError(409));
  }

  async uesNotification(req, res, next) {
    const [notification] = await Notification.getOne(req.params.nid);
    if (notification) {
      const used = await Notification.uesd(req.params.nid);
      if (notification.USED) {
        return next(new ApplicationError(400, 'The notification has been used'));
      } else if (used['affectedRows']) {
        return res.status(200).json({
          success: true,
          message: 'Data update successful.',
          data: 'OK',
        });
      }
      return next(new ApplicationError(400));
    }
    return next(new ApplicationError(409));
  }

  async createNotification(req, res, next) {
    let sender, recipient;
    const defaultContent = new Promise(async (resolve, reject) => {
      try {
        if (req.body.type === 'Guild') {
          [sender] = await Guild.getGuild(req.body.senderId);
          [recipient] = await User.getOneById(req.body.recipientId);
          const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.NAME, recipient.NAME);
          const content = notificationContent.guild();
          resolve(content);
        } else if (req.body.type === 'User') {
          [sender] = await User.getOneById(req.body.senderId);
          [recipient] = await User.getOneById(req.body.recipientId);
          const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.NAME, recipient.NAME);
          const content = notificationContent.user();
          resolve(content);
        } else return next(new ApplicationError(400));
      } catch (err) {
        reject(err);
      }
    });

    const content = await defaultContent;
    const newNotification = await Notification.create(
      req.body.senderId,
      req.body.recipientId,
      content.TITLE,
      content.DESCRIPTION,
      req.body.type
    );
    if (newNotification && newNotification.insertId) {
      return res.status(200).json({ data: 'OK' });
    }
  }

  async deleteNotification(req, res, next) {
    const notification = await Notification.delete(req.params.nid);
    if (notification['affectedRows']) {
      return res.status(200).json({ data: 'OK' });
    }
    return next(new ApplicationError(404));
  }
}

module.exports = NotificationController;
