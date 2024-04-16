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

}

module.exports = ItemModel;