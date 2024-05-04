const connection = require('../lib/db');

class TemplateItemModel {
  static addTemplateItem(TEMPLATE_ID, CONTENT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO templateItems(TEMPLATE_ID , CONTENT) VALUES (?,?)',
        [TEMPLATE_ID, CONTENT],
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

  static getTemplateItem(TEMPLATE_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM templateItems WHERE TEMPLATE_ID = ? AND ACTIVE = TRUE',
        [TEMPLATE_ID],
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

  static updateTemplateItem(ID, CONTENT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE templateItems SET CONTENT = ? WHERE ID = ?',
        [CONTENT, ID],
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

  static deleteTemplateItem(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE templateItems SET ACTIVE = FALSE WHERE ID  = ?',
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

  static deleteTemplateItemByTTId(TEMPLATE_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE templateItems SET ACTIVE = FALSE WHERE TEMPLATE_ID  = ?',
        [TEMPLATE_ID],
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

module.exports = TemplateItemModel;
