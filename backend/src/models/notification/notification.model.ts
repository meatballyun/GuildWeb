// @ts-nocheck
import connection from '../../lib/db';
import { convertKeysToCamelCase } from '../../utils/convertToCamelCase';

class NotificationModel {
  static getOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM notifications WHERE ID = ? AND ACTIVE = TRUE',
        [ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const notification = convertKeysToCamelCase(rows[0]);
              resolve(notification);
            }
          }
        }
      );
    });
  }

  static getAll(RECIPIENT_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM notifications WHERE RECIPIENT_ID = ? AND ACTIVE = TRUE ORDER BY CREATE_TIME DESC',
        [RECIPIENT_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const notifications = rows.map(convertKeysToCamelCase);
              resolve(notifications);
            }
          }
        }
      );
    });
  }

  static create(SENDER_ID, RECIPIENT_ID, TITLE, DESCRIPTION, TYPE) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO notifications(SENDER_ID , RECIPIENT_ID, TITLE, DESCRIPTION, TYPE) VALUES (?,?,?,?,?)',
        [SENDER_ID, RECIPIENT_ID, TITLE, DESCRIPTION, TYPE],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows.affectedRows);
          }
        }
      );
    });
  }

  static read(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE notifications SET `READ` = TRUE WHERE ID = ?',
        [ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows.affectedRows);
          }
        }
      );
    });
  }

  static use(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE notifications SET USED = TRUE WHERE ID = ?',
        [ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows.affectedRows);
          }
        }
      );
    });
  }

  static delete(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE notifications SET ACTIVE = FALSE WHERE ID = ?',
        [ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows.affectedRows);
          }
        }
      );
    });
  }
}

export default NotificationModel;
