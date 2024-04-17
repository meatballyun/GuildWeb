const connection = require('../lib/db');

class ItemRecordModel {
  static addItemRecord(ITEMS_ID, CONTENT, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO itemRecords(ITEMS_ID , CONTENT, USER_ID) VALUES (?,?,?)', [ITEMS_ID , CONTENT, USER_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getItemRecord(ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM itemRecords WHERE ID = ? AND ACTIVE = TRUE', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateItemRecord(ID, STATUS) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE itemRecords SET STATUS = ? WHERE ID = ?', [ID, STATUS], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static deleteItemRecord(ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE itemRecords SET ACTIVE = FALSE WHERE ID = ?', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

}

module.exports = ItemRecordModel;