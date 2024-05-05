const connection = require('../lib/db');

class RecipeModel {
  static getOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM recipes WHERE ID = ?', ID, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getAllByUser(CREATOR) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipes WHERE CREATOR = ? AND ACTIVE = TRUE',
        CREATOR,
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
        'SELECT * FROM recipes WHERE CREATOR != ? AND PUBLISHED = TRUE AND ACTIVE = TRUE',
        CREATOR,
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
    console.log(NAME);
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipes WHERE CREATOR = ? AND NAME LIKE ? AND ACTIVE = TRUE',
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
        'SELECT * FROM recipes WHERE CREATOR != ? AND NAME = ? AND PUBLISHED = TRUE AND ACTIVE = TRUE',
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
        'INSERT INTO recipes(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) VALUES (?,?,?,?,?,?,?,?,?,?)',
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

  static publish(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE recipes 
        SET PUBLISHED = CASE 
          WHEN PUBLISHED = TRUE THEN FALSE 
          ELSE TRUE 
        END 
        WHERE ID = ?;`,
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

  static update(ID, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE recipes SET NAME = ?, DESCRIPTION = ?, CARBS = ?, PRO = ?, FATS = ?, KCAL = ?, UNIT = ?, IMAGE_URL = ?, PUBLISHED = ? WHERE ID = ?',
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

  static updateNutrition(ID, CARBS, PRO, FATS, KCAL) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE recipes SET CARBS = ?, PRO = ?, FATS = ?, KCAL = ? WHERE ID = ?',
        [CARBS, PRO, FATS, KCAL, ID],
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
      connection.query('UPDATE recipes SET ACTIVE = FALSE WHERE ID = ?', ID, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = RecipeModel;
