const connection = require('../lib/db');

class IngredientModel {
    static addIngredient(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO ingredients(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) VALUES (?,?,?,?,?,?,?,?,?,?)', [CREATOR , NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED], function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static getIngredientsByCreator(CREATOR) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ingredients WHERE CREATOR = ?', CREATOR, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static getIngredientsByName(NAME) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ingredients WHERE NAME = ?', NAME, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static getIngredientsByCreatorAndName(CREATOR, NAME) {
        console.log(NAME);
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ingredients WHERE CREATOR = ? AND NAME LIKE ?', [ CREATOR, '%'+ NAME + '%' ], function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static getIngredientsById(ID) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ingredients WHERE ID = ?', ID, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static deleteIngredientsById(ID) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM ingredients WHERE ID = ?', ID, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
};

module.exports = IngredientModel;