const ApplicationError = require('../../utils/error/applicationError.js');
const Guild = require('../../models/guildModel.js');
const Notification = require('../../models/notificationModel.js');
const DEFAULT_NOTIFICATION_CONTENT = require('./default_notification_template.js');
const User = require('../../models/userModel.js');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const notifications = await Notification.getNotifications(req.session.passport.user);
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
              const [query] = await User.getUserById(row.SENDER_ID);
              if (query) {
                sender = {
                  id: query.ID,
                  name: query.NAME,
                  imageUrl: query.IMAGE_URL,
                };
              } else return next(new ApplicationError(409));
            } else {
              sender = {
                id: 1,
                name: 'System',
                imageUrl: 'System_Image',
              };
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
      return res.status(200).json({
        success: true,
        message: 'Data retrieval successful.',
        data: data,
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async getNotificationDetail(req, res, next) {
    try {
      const [notification] = await Notification.getNotification(req.params.nid);
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
          const [query] = await User.getUserById(notification.SENDER_ID);
          if (query) {
            sender = {
              id: query.ID,
              name: query.NAME,
              imageUrl: query.IMAGE_URL,
            };
          } else return next(new ApplicationError(409));
        } else {
          sender = {
            id: 1,
            name: 'System',
            imageUrl: 'System_Image',
          };
        }
        await Notification.readNotifications(req.params.nid);

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
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async uesNotification(req, res, next) {
    try {
      const [notification] = await Notification.getNotification(req.params.nid);
      if (notification) {
        const used = await Notification.uesNotification(req.params.nid);
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
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async addNotification(req, res, next) {
    try {
      let sender, recipient;
      const defaultContent = new Promise(async (resolve, reject) => {
        try {
          if (req.body.type === 'Guild') {
            [sender] = await Guild.getGuild(req.body.senderId);
            [recipient] = await User.getUserById(req.body.recipientId);
            const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(
              sender.NAME,
              recipient.NAME
            );
            const content = notificationContent.guild();
            resolve(content);
          } else if (req.body.type === 'User') {
            [sender] = await User.getUserById(req.body.senderId);
            [recipient] = await User.getUserById(req.body.recipientId);
            const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(
              sender.NAME,
              recipient.NAME
            );
            const content = notificationContent.user();
            resolve(content);
          } else {
            return next(new ApplicationError(400, 'Invalid notification type.'));
          }
        } catch (err) {
          reject(err);
        }
      });

      const content = await defaultContent;
      const newNotification = await Notification.addNotification(
        req.body.senderId,
        req.body.recipientId,
        content.TITLE,
        content.DESCRIPTION,
        req.body.type
      );
      if (newNotification && newNotification.insertId) {
        return res.status(200).json({
          success: true,
          message: 'Notification created successfully.',
          data: 'OK',
        });
      } else {
        return next(
          new ApplicationError(
            500,
            'Unable to create notification. Please check your database configuration.'
          )
        );
      }
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const notification = await Notification.deleteNotification(req.params.nid);
      if (notification['affectedRows']) {
        return res.status(200).json({
          success: true,
          message: 'Notification delete successful.',
          data: 'OK',
        });
      } else return next(new ApplicationError(404, 'The notification is not found.'));
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }
}

module.exports = NotificationController;
