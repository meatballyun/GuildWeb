const connection = require('../lib/db');

class AdventurerModel {
  static addItem(TASK_ID , USER_ID, ACCEPTANCE_TIME, STATUS) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO adventurers(TASK_ID , USER_ID, ACCEPTANCE_TIME, STATUS) VALUES (?,?,?,?)', [TASK_ID , USER_ID, ACCEPTANCE_TIME, STATUS], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

}

module.exports = AdventurerModel;