const connection = require('../lib/db');

class IngredientModel {
  static getOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM ingredients WHERE ID = ? AND ACTIVE = TRUE',
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

  static getAllByUser(CREATOR) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM ingredients WHERE CREATOR = ? AND ACTIVE = TRUE',
        [CREATOR],
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

  static getAllByNotUser(CREATOR) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM ingredients WHERE CREATOR != ? AND ACTIVE = TRUE AND PUBLISHED = TRUE',
        [CREATOR],
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

  static getAllByUserAndName(CREATOR, NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM ingredients WHERE CREATOR = ? AND NAME LIKE ? AND ACTIVE = TRUE',
        [CREATOR, '%' + NAME + '%'],
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

  static getAllByNotUserAndName(CREATOR, NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM ingredients WHERE CREATOR != ? AND NAME = ? AND ACTIVE = TRUE AND PUBLISHED = TRUE',
        [CREATOR, NAME],
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

  static create(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO ingredients(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED],
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

  static publishTorF(ID, TorF) {
    console.log(ID, TorF);
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE ingredients SET PUBLISHED = ? WHERE ID = ?;`,
        [TorF, ID],
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

  static update(ID, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE ingredients SET NAME = ?, DESCRIPTION = ?, CARBS = ?, PRO = ?, FATS = ?, KCAL = ?, UNIT = ?, IMAGE_URL = ?, PUBLISHED = ? WHERE ID = ?',
        [NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED, ID],
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

  static delete(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE ingredients SET ACTIVE = FALSE WHERE ID = ?',
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
}

module.exports = IngredientModel;
