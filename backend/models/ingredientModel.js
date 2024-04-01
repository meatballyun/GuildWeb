const connection = require('../lib/db');

class IngredientModel {
    static addIngredient(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO ingredients(CREATOR, NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED) VALUES (?,?,?,?,?,?,?,?)', [CREATOR , NAME, DESCRIPTION, CARBS, PRO, FATS, KCAL, UNIT, IMAGE_URL, PUBLISHED], function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static getIngredientsByCreator(userId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ingredients WHERE CREATOR = ?', userId, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static getIngredientsByName(name) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ingredients WHERE NAME = ?', name, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static getIngredientsByCreatorAndName(userId, name) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ingredients WHERE CREATOR = ? AND NAME = ?', userId, name, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    static getIngredientsById(Id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM ingredients WHERE ID = ?', Id, function (err, rows) {
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