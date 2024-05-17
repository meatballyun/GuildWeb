// @ts-nocheck
import connection from '../../lib/db';
import { convertKeysToCamelCase } from '../../utils/convertToCamelCase';

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
            if (rows.length === 0) resolve(false);
            else {
              const items = rows.map(convertKeysToCamelCase);
              resolve(items);
            }
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
            resolve(rows.insertId);
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
            resolve(rows.affectedRows);
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
          resolve(rows.affectedRows);
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
            resolve(rows.affectedRows);
          }
        }
      );
    });
  }
}

export default ItemModel;
