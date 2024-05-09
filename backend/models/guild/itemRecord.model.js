const connection = require('../../lib/db');
const { convertKeysToCamelCase } = require('../../utils/convertToCamelCase.js');

class ItemRecordModel {
  static getOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM itemRecords WHERE ID = ? AND ACTIVE = TRUE',
        [ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const itemRecord = convertKeysToCamelCase(rows[0]);
              resolve(itemRecord);
            }
          }
        }
      );
    });
  }

  static getAllByItem(ITEM_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM itemRecords WHERE ITEMS_ID = ? AND ACTIVE = TRUE',
        [ITEM_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const itemRecords = rows.map(convertKeysToCamelCase);
              resolve(itemRecords);
            }
          }
        }
      );
    });
  }

  static getAllByItemAndUser(ITEM_ID, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM itemRecords WHERE ITEMS_ID = ? AND USER_ID = ? AND ACTIVE = TRUE',
        [ITEM_ID, USER_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const itemRecords = rows.map(convertKeysToCamelCase);
              resolve(itemRecords);
            }
          }
        }
      );
    });
  }

  static create(ITEMS_ID, CONTENT, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO itemRecords(ITEMS_ID , CONTENT, USER_ID) VALUES (?,?,?)',
        [ITEMS_ID, CONTENT, USER_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows.insertId);
          }
        }
      );
    });
  }

  static update(ID, STATUS) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE itemRecords SET STATUS = ? WHERE ID = ?',
        [STATUS, ID],
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

  static deleteOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE itemRecords SET ACTIVE = FALSE WHERE ID =?',
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

  static deleteAllByItem(ITEMS_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE itemRecords SET ACTIVE = FALSE WHERE ITEMS_ID =?',
        [ITEMS_ID],
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

  static deleteAllByItemAndUser(ITEMS_ID, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE itemRecords SET ACTIVE = FALSE WHERE ITEMS_ID = ? AND USER_ID = ?',
        [ITEMS_ID, USER_ID],
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

module.exports = ItemRecordModel;
