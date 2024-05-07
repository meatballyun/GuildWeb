const ApplicationError = require('../../utils/error/applicationError.js');
const convertToCamelCase = require('../../utils/convertToCamelCase.js');
const Guild = require('../../models/guild/guild.model.js');
const Notification = require('../../models/notification/notification.model.js');
const DEFAULT_NOTIFICATION_CONTENT = require('./default_notification_template.js');
const User = require('../../models/user/user.model.js');

class NotificationRepository {
  async getAll(uid) {
    const notifications = await Notification.getAll(uid);
    let data;
    const hasNotification = notifications?.length;
    if (hasNotification) {
      data = await Promise.all(
        notifications.map(async (row) => {
          const { sender, id, createTime, title, read, type } = await this.getOne(row.ID);
          return { sender, id, createTime, title, read, type };
        })
      );
    }
    return data;
  }

  async getOne(nid) {
    const [notification] = await Notification.getOne(nid);
    const hasNotification = notification.ID;
    if (hasNotification) {
      let sender;
      if (notification.TYPE === 'Guild') {
        const [guild] = await Guild.getOne(notification.SENDER_ID);
        if (!guild) throw new ApplicationError(409);
        sender = {
          id: guild.ID,
          name: guild.NAME,
          imageUrl: guild.IMAGE_URL,
        };
      } else if (notification.TYPE === 'User') {
        const [user] = await User.getOneById(notification.SENDER_ID);
        if (!user) throw new ApplicationError(409);
        sender = {
          id: user.ID,
          name: user.NAME,
          imageUrl: user.IMAGE_URL,
        };
      } else throw new ApplicationError(409);
      const data = { sender: sender, ...convertToCamelCase(notification) };
      return data;
    }
    throw new ApplicationError(404);
  }

  async create({ senderId, recipientId, type }) {
    const defaultContent = await new Promise(async (resolve, reject) => {
      const [recipient] = await User.getOneById(recipientId);
      if (type === 'Guild') {
        const [sender] = await Guild.getGuild(senderId);
        const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.NAME, recipient.NAME);
        const content = notificationContent.guild();
        resolve(content);
      }
      if (type === 'User') {
        const [sender] = await User.getOneById(senderId);
        const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.NAME, recipient.NAME);
        const content = notificationContent.user();
        resolve(content);
      }
      const [sender] = await User.getOneById(senderId);
      const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.NAME, recipient.NAME);
      const content = notificationContent.system();
      resolve(content);
    });
    const newNotification = await Notification.create(
      senderId,
      recipientId,
      defaultContent.TITLE,
      defaultContent.DESCRIPTION,
      type
    );
    const hasNewNotification = newNotification['insertId'];
    if (hasNewNotification) {
      return 'OK';
    }
    throw new ApplicationError(400);
  }

  async read(nid) {
    const isRead = await Notification.read(nid);
    if (isRead['affectedRows']) return true;
    throw new ApplicationError(400);
  }

  async use(nid) {
    const [notification] = await Notification.getOne(nid);
    if (notification) {
      if (notification.USED) throw new ApplicationError(400);
      const result = await Notification.use(nid);
      if (result['affectedRows']) return 'OK';
      throw new ApplicationError(400);
    }
    throw new ApplicationError(409);
  }

  async delete(nid) {
    const notification = await Notification.delete(nid);
    if (notification['affectedRows']) {
      return 'OK';
    }
    throw new ApplicationError(404);
  }
}

module.exports = NotificationRepository;
