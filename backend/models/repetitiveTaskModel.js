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

}

module.exports = RepetitiveTaskModel;