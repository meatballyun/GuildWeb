const connection = require('../../lib/db');
const { convertKeysToCamelCase } = require('../../utils/convertToCamelCase.js');

class AdventurerModel {
  static getOne(TASK_ID, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM adventurers WHERE TASK_ID = ? AND USER_ID = ?`,
        [TASK_ID, USER_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const adventurer = convertKeysToCamelCase(rows[0]);
              resolve(adventurer);
            }
          }
        }
      );
    });
  }

  static getAllByTask(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM adventurers WHERE TASK_ID = ?`,
        [TASK_ID],
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

  static getAllByUser(USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM adventurers WHERE USER_ID = ?`,
        [USER_ID],
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

  static create(TASK_ID, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO adventurers(TASK_ID , USER_ID, ACCEPTANCE_TIME, STATUS) VALUES (?, ?, CURDATE(), 'Accepted')`,
        [TASK_ID, USER_ID],
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

  static update(TASK_ID, USER_ID, STATUS, COMPLETED_TIME) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE adventurers SET STATUS = ?, COMPLETED_TIME = ? WHERE TASK_ID = ? AND USER_ID = ?`,
        [STATUS, COMPLETED_TIME, TASK_ID, USER_ID],
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

  static updateStatus(TASK_ID, USER_ID, STATUS) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE adventurers SET STATUS = ? WHERE TASK_ID = ? AND USER_ID = ?`,
        [STATUS, TASK_ID, USER_ID],
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

  static deleteByTask(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM adventurers WHERE TASK_ID = ?`,
        [TASK_ID],
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

  static deleteByTaskAndUser(TASK_ID, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM adventurers WHERE TASK_ID = ? AND USER_ID = ?`,
        [TASK_ID, USER_ID],
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

module.exports = AdventurerModel;
