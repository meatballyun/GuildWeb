const connection = require('../lib/db');

class ItemModel {
  static addItem(TASK_ID , CONTENT) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO items(TASK_ID , CONTENT) VALUES (?,?)', [TASK_ID , CONTENT], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getItem(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM items WHERE TASK_ID = ? AND ACTIVE = TRUE', [TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateItem(TASK_ID, CONTENT) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE items SET CONTENT = ? WHERE TASK_ID = ?', [CONTENT, TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static deleteItem(ID) {
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

  static deleteItems(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE items SET ACTIVE = FALSE WHERE TASK_ID = ?', [TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

}

module.exports = ItemModel;