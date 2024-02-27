const connection = require('../lib/db');

class IngredientModel {
    static addIngredient(creator, name, description, carbs, pro, fats, kcal, unit) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO Ingredients(creator, name, description, carbs, pro, fats, kcal, unit) VALUES (?,?,?,?,?,?,?,?)', [creator, name, description, carbs, pro, fats, kcal, unit], function (err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve('');
                }
            });
        });
    }

    static getIngredientsByCreator(user_id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Ingredients WHERE creator = ?', user_id, function (err, rows) {
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