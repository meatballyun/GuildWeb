// @ts-nocheck
import connection from '../../lib/db';
import { convertKeysToCamelCase } from '../../utils/convertToCamelCase';

class RecipeModel {
  static getOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM recipes WHERE ID = ?', ID, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          if (rows.length === 0) resolve(false);
          else {
            const recipe = convertKeysToCamelCase(rows[0]);
            resolve(recipe);
          }
        }
      });
    });
  }

  static getAllByUserAndName(CREATOR, NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipes WHERE CREATOR = ? AND NAME LIKE ? AND ACTIVE = TRUE',
        [CREATOR, '%' + NAME + '%'],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const recipes = rows.map(convertKeysToCamelCase);
              resolve(recipes);
            }
          }
        }
      );
    });
  }

  static getAllByName(NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipes WHERE NAME = ? AND PUBLISHED = TRUE AND ACTIVE = TRUE',
        ['%' + NAME + '%'],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const recipes = rows.map(convertKeysToCamelCase);
              resolve(recipes);
            }
          }
        }
      );
    });
  }

  static create(creator, { name, description, carbs, pro, fats, kcal, unit, imageUrl, published }) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO recipes(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) VALUES (?,?,?,?,?,?,?,?,?,?)',
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
            resolve(rows.affectedRows);
          }
        }
      );
    });
  }

  static update(id, { name, description, carbs, pro, fats, kcal, unit, imageUrl, published }) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE recipes SET NAME = ?, DESCRIPTION = ?, CARBS = ?, PRO = ?, FATS = ?, KCAL = ?, UNIT = ?, IMAGE_URL = ?, PUBLISHED = ? WHERE ID = ?',
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

  static updateNutrition(ID, CARBS, PRO, FATS, KCAL) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE recipes SET CARBS = ?, PRO = ?, FATS = ?, KCAL = ? WHERE ID = ?',
        [CARBS, PRO, FATS, KCAL, ID],
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
      connection.query('UPDATE recipes SET ACTIVE = FALSE WHERE ID = ?', ID, function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows.affectedRows);
        }
      });
    });
  }
}

export default RecipeModel;
