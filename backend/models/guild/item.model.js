const connection = require('../../lib/db');

class ItemModel {
  static getAll(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM items WHERE TASK_ID = ? AND ACTIVE = TRUE',
        [TASK_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static create(TASK_ID, CONTENT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO items(TASK_ID , CONTENT) VALUES (?,?)',
        [TASK_ID, CONTENT],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static update(ID, CONTENT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE items SET CONTENT = ? WHERE ID = ?',
        [CONTENT, ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static delete(ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE items SET ACTIVE = FALSE WHERE ID = ?', [ID], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static deleteAll(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE items SET ACTIVE = FALSE WHERE TASK_ID = ?',
        [TASK_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = ItemModel;
