// @ts-nocheck
import connection from '../../lib/db';
import { convertKeysToCamelCase } from '../../utils/convertToCamelCase';

export class UserModel {
  static getOneById(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE ID = ? AND STATUS = 'Confirmed'`,
        ID,
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const user = convertKeysToCamelCase(rows[0]);
              resolve(user);
            }
          }
        }
      );
    });
  }

  static getOneByEmail(EMAIL) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE EMAIL = ?', EMAIL, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          if (rows.length === 0) resolve(false);
          else {
            const user = convertKeysToCamelCase(rows[0]);
            resolve(user);
          }
        }
      });
    });
  }

  static getAllByName(NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE NAME LIKE ? AND STATUS = 'Confirmed'`,
        ['%' + NAME + '%'],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const user = rows.map(convertKeysToCamelCase);
              resolve(user);
            }
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
            resolve(rows.affectedRows);
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
            resolve(rows.affectedRows);
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
            resolve(rows.affectedRows);
          }
        }
      );
    });
  }

  static updateInfo(ID, { name, imageUrl, carbs, pro, fats, kcal }) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET NAME =?, IMAGE_URL = ?, CARBS = ?, PRO = ?, FATS = ?, KCAL = ? WHERE ID = ?',
        [name, imageUrl, carbs, pro, fats, kcal, ID],
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

  static updateExp(ID, EXP) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET EXP = ? WHERE ID = ?', [EXP, ID], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows.affectedRows);
        }
      });
    });
  }

  static upgrade(ID, RANK) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE users SET `RANK` = ? WHERE ID = ?',
        [RANK, ID],
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
