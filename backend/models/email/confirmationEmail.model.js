const connection = require('../../lib/db');
const { convertKeysToCamelCase } = require('../../utils/convertToCamelCase.js');

class ConfirmationEmailModel {
  static getLatestByUser(USER_ID, TYPE) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM confirmationEmails WHERE USER_ID = ? AND TYPE = ? ORDER BY CREATE_TIME DESC  LIMIT 1',
        [USER_ID, TYPE],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const email = convertKeysToCamelCase(rows[0]);
              resolve(email);
            }
          }
        }
      );
    });
  }

  static create(USER, TYPE, CODE) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO confirmationEmails(USER_ID, TYPE, CODE) VALUES (?,?,?)',
        [USER, TYPE, CODE],
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

  static update(USER_ID, STATUS, TYPE) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE confirmationEmails SET STATUS = ? WHERE USER_ID = ? AND TYPE = ?',
        [STATUS, USER_ID, TYPE],
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

module.exports = ConfirmationEmailModel;
