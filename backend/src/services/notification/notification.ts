import { DEFAULT_NOTIFICATION_CONTENT } from './default_notification_template';
import { ApplicationError } from '../../utils/error/applicationError';
import { BaseNotification } from '../../types/notification/notification';
import { UserModel, NotificationModel, GuildModel } from '../../models';

export const getAll = async (uid: number) => {
  const notifications = await NotificationModel.getAll(uid);
  let data;
  if (notifications) {
    data = await Promise.all(
      notifications.map(async ({ sender, id, createTime, title, read, type }) => {
        return { sender, id, createTime, title, read, type };
      })
    );
  }
  return data;
};

export const getOne = async (nid: number) => {
  const notification = await NotificationModel.getOne(nid);
  if (notification) {
    let sender;
    if (notification.type === 'guild') {
      const guild = await GuildModel.getOne(notification.senderId);
      if (!guild) throw new ApplicationError(409);
      sender = {
        id: guild.id,
        name: guild.name,
        imageUrl: guild.imageUrl,
      };
    } else if (notification.type === 'user') {
      const user = await UserModel.getOneById(notification.senderId);
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
};

export const create = async ({ senderId, recipientId, type }: Pick<BaseNotification, 'senderId' | 'recipientId' | 'type'>) => {
  const defaultContent = await new Promise<{ title: string; description: string }>(async (resolve, reject) => {
    const recipient = await UserModel.getOneById(recipientId);
    if (!recipient) throw new ApplicationError(400);

    if (type === 'guild') {
      const sender = await GuildModel.getOne(senderId);
      if (!sender) throw new ApplicationError(400);
      const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.name, recipient.name);
      const content = notificationContent.guild();
      resolve(content);
      return;
    }

    if (type === 'user') {
      const sender = await UserModel.getOneById(senderId);
      if (!sender) throw new ApplicationError(400);
      const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.name, recipient.name);
      const content = notificationContent.user();
      resolve(content);
      return;
    }

    if (type === 'system') {
      const sender = await UserModel.getOneById(senderId);
      if (!sender) throw new ApplicationError(400);
      const notificationContent = new DEFAULT_NOTIFICATION_CONTENT(sender.name, recipient.name);
      const content = notificationContent.system();
      resolve(content);
      return;
    }
    reject('Notification type error');
  });

  const newNotification = await NotificationModel.create(senderId, recipientId, defaultContent.title, defaultContent.description, type);
  if (!newNotification) throw new ApplicationError(400);
};

export const read = async (nid: number) => {
  const isRead = await NotificationModel.read(nid);
  if (isRead) return true;
  throw new ApplicationError(400);
};

export const use = async (nid: number) => {
  const notification = await NotificationModel.getOne(nid);
  if (notification) {
    if (notification.used) throw new ApplicationError(400);
    const result = await NotificationModel.use(nid);
    if (result) return;
    throw new ApplicationError(400);
  }
  throw new ApplicationError(409);
};

export const remove = async (nid: number) => {
  const notification = await NotificationModel.delete(nid);
  if (notification) {
    return 'OK';
  }
  throw new ApplicationError(404);
};
