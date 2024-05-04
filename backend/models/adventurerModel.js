const connection = require('../lib/db');

class AdventurerModel {
  static addAdventurer(TASK_ID, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO adventurers(TASK_ID , USER_ID, ACCEPTANCE_TIME, STATUS) VALUES (?, ?, CURDATE(), 'Accepted')`,
        [TASK_ID, USER_ID],
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

  static getAdventurerByTask(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM adventurers WHERE TASK_ID = ?`,
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

  static getAdventurerByUser(USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM adventurers WHERE USER_ID = ?`,
        [USER_ID],
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

  static getAdventurerByTaskAndUser(TASK_ID, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM adventurers WHERE TASK_ID = ? AND USER_ID = ?`,
        [TASK_ID, USER_ID],
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

  static updateAdventurerByTaskAndUser(TASK_ID, USER_ID, STATUS, COMPLETED_TIME) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE adventurers SET STATUS = ?, COMPLETED_TIME = ? WHERE TASK_ID = ? AND USER_ID = ?`,
        [STATUS, COMPLETED_TIME, TASK_ID, USER_ID],
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

  static deleteAdventurerByTask(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM adventurers WHERE TASK_ID = ?`,
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

  static deleteAdventurerByTaskAndUser(TASK_ID, USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM adventurers WHERE TASK_ID = ? AND USER_ID = ?`,
        [TASK_ID, USER_ID],
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

module.exports = AdventurerModel;
