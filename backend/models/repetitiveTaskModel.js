const connection = require('../lib/db');

class RepetitiveTaskModel {
  static DATE_ADD(CURRENT , INTERVAL, UNIT) {
    const query = 'SELECT DATE_ADD(?, INTERVAL ? ' + UNIT + ');';
    return new Promise((resolve, reject) => {
      connection.query(query, [CURRENT, INTERVAL], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static addRepetitiveTask(TASK_ID , GENERRATION_TIME, TYPE) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO repetitiveTasks(TASK_ID , GENERRATION_TIME, TYPE) VALUES (?,?,?)', [TASK_ID , GENERRATION_TIME, TYPE], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getRepetitiveTask(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM repetitiveTasks WHERE TASK_ID = ?', [TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateRepetitiveTask(TASK_ID , GENERRATION_TIME, TYPE) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE repetitiveTasks SET GENERRATION_TIME = ?, TYPE = ? WHERE TASK_ID = ?', [GENERRATION_TIME, TYPE, TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

}

module.exports = RepetitiveTaskModel;