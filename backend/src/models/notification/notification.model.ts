import conn from '../../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

type NotificationType = 'guild' | 'system' | 'user';

interface BaseNotification {
  senderId: number;
  recipientId: number;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  used: boolean;
}

interface Notification extends BaseNotification, RowDataPacket {
  id: number;
  createTime: Date;
  updateTime: Date;
  active: boolean;
}

class NotificationModel {
  static getOne(id: number): Promise<Notification | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Notification[]>('SELECT * FROM notifications WHERE id = ? AND active = TRUE', [id], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAll(recipientId: number): Promise<Notification[] | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Notification[]>('SELECT * FROM notifications WHERE recipientId = ? AND active = TRUE ORDER BY CREATE_TIME DESC', [recipientId], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows);
        resolve(undefined);
      });
    });
  }

  static create(senderId: number, recipientId: number, title: string, description: string, type: NotificationType): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO notifications(senderId , recipientId, title, description, type) VALUES (?,?,?,?,?)',
        [senderId, recipientId, title, description, type],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.insertId);
        }
      );
    });
  }

  static read(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE notifications SET `READ` = TRUE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static use(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE notifications SET USED = TRUE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE notifications SET active = FALSE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}

export default NotificationModel;
