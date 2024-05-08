const connection = require('../../lib/db');
const { convertKeysToCamelCase } = require('../../utils/convertToCamelCase.js');

class RecipeIngredientRelationModel {
  static getAllByIngredient(INGREDIENT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipeIngredientRelations WHERE INGREDIENTS = ? AND RECIPES IN (SELECT ID FROM recipes WHERE ACTIVE = TRUE)',
        INGREDIENT,
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const recipeIngredientRelations = rows.map(convertKeysToCamelCase);
              resolve(recipeIngredientRelations);
            }
          }
        }
      );
    });
  }

  static getAllByRecipe(RECIPES) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipeIngredientRelations WHERE RECIPES = ? AND AMOUNT > 0',
        RECIPES,
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const recipeIngredientRelations = rows.map(convertKeysToCamelCase);
              resolve(recipeIngredientRelations);
            }
          }
        }
      );
    });
  }

  static getOne(INGREDIENTS, RECIPES) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipeIngredientRelations WHERE INGREDIENTS = ? AND RECIPES = ?',
        [INGREDIENTS, RECIPES],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const recipeIngredientRelation = convertKeysToCamelCase(rows[0]);
              resolve(recipeIngredientRelation);
            }
          }
        }
      );
    });
  }

  static create(INGREDIENTS, RECIPES, AMOUNT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO recipeIngredientRelations(INGREDIENTS, RECIPES, AMOUNT) VALUES (?,?,?)',
        [INGREDIENTS, RECIPES, AMOUNT],
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

  static update(INGREDIENTS, RECIPES, AMOUNT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE recipeIngredientRelations SET AMOUNT = ? WHERE INGREDIENTS = ? AND RECIPES = ?',
        [AMOUNT, INGREDIENTS, RECIPES],
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

  static deleteByIngredientAndRecipe(INGREDIENT, RECIPE) {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM recipeIngredientRelations WHERE INGREDIENTS = ? AND RECIPES = ?',
        [INGREDIENT, RECIPE],
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

  static deleteByRecipe(RECIPES) {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM recipeIngredientRelations WHERE RECIPES = ?',
        RECIPES,
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

module.exports = RecipeIngredientRelationModel;
