const connection = require('../lib/db');

class RecipeModel {
    static addRecipe(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO recipes(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) VALUES (?,?,?,?,?,?,?,?,?,?)', [CREATOR , NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED], function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static updateRecipe(ID, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE recipes SET NAME = ?, DESCRIPTION = ?, CARBS = ?, PRO = ?, FATS = ?, KCAL = ?, UNIT = ?, IMAGE_URL = ?, PUBLISHED = ? WHERE ID = ?', [NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED, ID], function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static getRecipes() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM recipes WHERE AND ACTIVE = TRUE', function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
    
    static getRecipesByName(NAME) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM recipes WHERE NAME = ? AND ACTIVE = TRUE', NAME, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
    
    static getRecipesByCreator(CREATOR) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM recipes WHERE CREATOR = ? AND ACTIVE = TRUE', CREATOR, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static getRecipesByCreatorAndName(CREATOR, NAME) {
        console.log(NAME);
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM recipes WHERE CREATOR = ? AND NAME LIKE ? AND ACTIVE = TRUE', [ CREATOR, '%'+ NAME + '%' ], function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static getRecipesById(ID) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM recipes WHERE ID = ?', ID, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static deleteRecipesById(ID) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE recipes SET ACTIVE = FALSE WHERE ID = ?', ID, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
};

module.exports = RecipeModel;