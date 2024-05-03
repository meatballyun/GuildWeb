const connection = require('../lib/db');

class NotificationModel {
  static addNotification(SENDER_ID , RECIPIENT_ID, TITLE, DESCRIPTION, TYPE) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO notifications(SENDER_ID , RECIPIENT_ID, TITLE, DESCRIPTION, TYPE) VALUES (?,?,?,?,?)', [SENDER_ID , RECIPIENT_ID, TITLE, DESCRIPTION, TYPE], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getNotification(ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM notifications WHERE ID = ? AND ACTIVE = TRUE', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getNotifications(RECIPIENT_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM notifications WHERE RECIPIENT_ID = ? AND ACTIVE = TRUE ORDER BY CREATE_TIME DESC', [RECIPIENT_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static uesNotification(ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE notifications SET USED = TRUE WHERE ID = ?', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static readNotifications(ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE notifications SET `READ` = TRUE WHERE ID = ?', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static deleteNotification(ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE notifications SET ACTIVE = FALSE WHERE ID = ?', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

}

module.exports = NotificationModel;