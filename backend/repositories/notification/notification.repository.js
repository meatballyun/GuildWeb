const ApplicationError = require('../../utils/error/applicationError.js');
const Guild = require('../../models/guild/guild.model.js');
const Notification = require('../../models/notification/notification.model.js');
const DEFAULT_NOTIFICATION_CONTENT = require('./default_notification_template.js');
const User = require('../../models/user/user.model.js');

class NotificationRepository {
  static async getAll(uid) {
    const notifications = await Notification.getAll(uid);
    let data;
    if (notifications) {
      data = await Promise.all(
        notifications.map(async ({ sender, id, createTime, title, read, type }) => {
          return { sender, id, createTime, title, read, type };
        })
      );
    }
    return data;
  }

  static async getOne(nid) {
    const notification = await Notification.getOne(nid);
    if (notification) {
      let sender;
      if (notification.type === 'Guild') {
        const guild = await Guild.getOne(notification.senderId);
        if (!guild) throw new ApplicationError(409);
        sender = {
          id: guild.id,
          name: guild.name,
          imageUrl: guild.imageUrl,
        };
      } else if (notification.type === 'User') {
        const user = await User.getOneById(notification.senderId);
        if (!user) throw new ApplicationError(409);
        sender = {
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl,
        };
      } else throw new ApplicationError(409);
      const data = { sender: sender, ...notification };
      return data;
    }
    throw new ApplicationError(404);
  }

  static async create({ senderId, recipientId, type }) {
    const defaultContent = await new Promise(async (resolve, reject) => {
      const recipient = await User.getOneById(recipientId);
      if (type === 'Guild') {
        const [sender] = await Guild.getGuild(senderId);
        const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.name, recipient.name);
        const content = notificationContent.guild();
        resolve(content);
      }
      if (type === 'User') {
        const sender = await User.getOneById(senderId);
        const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.name, recipient.name);
        const content = notificationContent.user();
        resolve(content);
      }
      const sender = await User.getOneById(senderId);
      const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.name, recipient.name);
      const content = notificationContent.system();
      resolve(content);
    });
    const newNotification = await Notification.create(
      senderId,
      recipientId,
      defaultContent.title,
      defaultContent.description,
      type
    );
    if (!newNotification) throw new ApplicationError(400);
  }

  static async read(nid) {
    const isRead = await Notification.read(nid);
    if (isRead) return true;
    throw new ApplicationError(400);
  }

  static async use(nid) {
    const notification = await Notification.getOne(nid);
    if (notification) {
      if (notification.used) throw new ApplicationError(400);
      const result = await Notification.use(nid);
      if (result) return;
      throw new ApplicationError(400);
    }
    throw new ApplicationError(409);
  }

  static async delete(nid) {
    const notification = await Notification.delete(nid);
    if (notification) {
      return 'OK';
    }
    throw new ApplicationError(404);
  }
}

module.exports = NotificationRepository;
