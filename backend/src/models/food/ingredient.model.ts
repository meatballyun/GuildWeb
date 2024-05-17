// @ts-nocheck
import connection from '../../lib/db';
import { convertKeysToCamelCase } from '../../utils/convertToCamelCase';

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
            if (rows.length === 0) resolve(false);
            else {
              const ingredient = convertKeysToCamelCase(rows[0]);
              resolve(ingredient);
            }
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
            if (rows.length === 0) resolve(false);
            else {
              const ingredients = rows.map(convertKeysToCamelCase);
              resolve(ingredients);
            }
          }
        }
      );
    });
  }

  static getAllByName(NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM ingredients WHERE NAME LIKE ? AND ACTIVE = TRUE AND PUBLISHED = TRUE',
        ['%' + NAME + '%'],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const ingredients = rows.map(convertKeysToCamelCase);
              resolve(ingredients);
            }
          }
        }
      );
    });
  }

  static create(creator, { name, description, carbs, pro, fats, kcal, unit, imageUrl, published }) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO ingredients(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [creator, name, description, carbs, pro, fats, kcal, unit, imageUrl, published],
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

  static copy(creator, { name, description, carbs, pro, fats, kcal, unit, imageUrl }, published) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO ingredients(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [creator, name, description, carbs, pro, fats, kcal, unit, imageUrl, published],
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

  static published(ID, TF) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE ingredients SET PUBLISHED = ? WHERE ID = ?;`,
        [TF, ID],
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

  static update(id, { name, description, carbs, pro, fats, kcal, unit, imageUrl, published }) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE ingredients SET NAME = ?, DESCRIPTION = ?, CARBS = ?, PRO = ?, FATS = ?, KCAL = ?, UNIT = ?, IMAGE_URL = ?, PUBLISHED = ? WHERE ID = ?',
        [name, description, carbs, pro, fats, kcal, unit, imageUrl, published, id],
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
        'UPDATE ingredients SET ACTIVE = FALSE WHERE ID = ?',
        ID,
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

export default IngredientModel;
