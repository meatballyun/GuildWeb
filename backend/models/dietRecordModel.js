const connection = require('../lib/db');

class DietRecordModel {
  static addDietRecord(CREATOR, DIET_DATE, CATEGORY, RECIPES, AMOUNT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO dietRecords(CREATOR, DIET_DATE, CATEGORY, RECIPES, AMOUNT) VALUES (?,?,?,?,?)',
        [CREATOR, DIET_DATE, CATEGORY, RECIPES, AMOUNT],
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

  static getDietRecord(CREATOR, DIET_DATE) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM dietRecords WHERE CREATOR = ? AND DIET_DATE = ? AND ACTIVE = TRUE',
        [CREATOR, DIET_DATE],
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

  static deleteDietRecord(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE dietRecords SET ACTIVE = FALSE WHERE ID = ?',
        [ID],
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

module.exports = DietRecordModel;
