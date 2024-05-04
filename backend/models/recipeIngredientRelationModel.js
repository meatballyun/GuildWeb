const connection = require('../lib/db');

class RecipeIngredientRelationModel {
  static getAllByIngredient(INGREDIENTS) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipeIngredientRelations WHERE INGREDIENTS = ? AND RECIPES IN (SELECT ID FROM recipes WHERE ACTIVE = TRUE)',
        INGREDIENTS,
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

  static getAllByRecipe(RECIPES) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipeIngredientRelations WHERE RECIPES = ? AND AMOUNT > 0',
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

  static getOne(INGREDIENTS, RECIPES) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM recipeIngredientRelations WHERE INGREDIENTS = ? AND RECIPES = ?',
        [INGREDIENTS, RECIPES],
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

  static create(INGREDIENTS, RECIPES, AMOUNT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO recipeIngredientRelations(INGREDIENTS, RECIPES, AMOUNT) VALUES (?,?,?)',
        [INGREDIENTS, RECIPES, AMOUNT],
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

  static update(INGREDIENTS, RECIPES, AMOUNT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE recipeIngredientRelations SET AMOUNT = ? WHERE INGREDIENTS = ? AND RECIPES = ?',
        [AMOUNT, INGREDIENTS, RECIPES],
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

  static deleteByIngredient(INGREDIENT) {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM recipeIngredientRelations WHERE RECIPES = ?',
        INGREDIENT,
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
