const connection = require('../../lib/db.js');
const { convertKeysToCamelCase } = require('../../utils/convertToCamelCase.js');

class TaskTemplateItemModel {
  static getAll(TEMPLATE_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM templateItems WHERE TEMPLATE_ID = ? AND ACTIVE = TRUE',
        [TEMPLATE_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const templateItem = rows.map(convertKeysToCamelCase);
              resolve(templateItem);
            }
          }
        }
      );
    });
  }

  static create(TEMPLATE_ID, CONTENT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO templateItems(TEMPLATE_ID , CONTENT) VALUES (?,?)',
        [TEMPLATE_ID, CONTENT],
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
        'UPDATE templateItems SET CONTENT = ? WHERE ID = ?',
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
      connection.query(
        'UPDATE templateItems SET ACTIVE = FALSE WHERE ID  = ?',
        [ID],
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

  static deleteByTaskTemplate(TEMPLATE_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE templateItems SET ACTIVE = FALSE WHERE TEMPLATE_ID  = ?',
        [TEMPLATE_ID],
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

module.exports = TaskTemplateItemModel;
