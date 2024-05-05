const connection = require('../lib/db');

class UserModel {
  static getOneById(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE ID = ? AND STATUS = 'Confirmed'`,
        ID,
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

  static getOneByEmail(EMAIL) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE EMAIL = ?', EMAIL, function (err, num) {
        if (err) {
          reject(err);
        } else {
          resolve(num);
        }
      });
    });
  }

  static getAll(NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE NAME LIKE ? AND STATUS = 'Confirmed'`,
        ['%' + NAME + '%'],
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

  static create(NAME, EMAIL, PASSWORD) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO users(NAME, EMAIL, PASSWORD) VALUES (?,?,?)',
        [NAME, EMAIL, PASSWORD],
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

  static updateStatus(STATUS, ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET STATUS = ? WHERE ID = ?',
        [STATUS, ID],
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

  static updatePassword(ID, PASSWORD) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET PASSWORD = ? WHERE ID = ?',
        [PASSWORD, ID],
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

  static updateInfo(ID, NAME, IMAGE_URL, CARBS, PRO, FATS, KCAL) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET NAME =?, IMAGE_URL = ?, CARBS = ?, PRO = ?, FATS = ?, KCAL = ? WHERE ID = ?',
        [NAME, IMAGE_URL, CARBS, PRO, FATS, KCAL, ID],
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

  static updateExp(EXP, ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET EXP = ? WHERE ID = ?', [EXP, ID], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static upgrade(RANK, ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET `RANK` = ? WHERE ID = ?',
        [RANK, ID],
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

module.exports = UserModel;
