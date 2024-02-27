const Ingredient = require('../models/ingredientModel.js');

class IngredientController {
    async addIngredient(req, res) {
        try {
            const creator = await new Promise((resolve, reject) => {
                if (!req.session.id) {
                    reject('');
                } else {
                    console.log('req.session.id:', req.session.id);
                    resolve(req.session.id);
                }
            });
            const test_user = 1;
            const temp = await Ingredient.addIngredient(test_user, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit);
            if (!temp) res.status(200).json({
                "status": "success",
                "message": "Ingredient add successfully",
            });
        } catch (error) {
            console.error(error);
            console.log('addIngredient Error!!!');
        }
    }

    async getIngredientsByCreator(req, res) {
        try {
            const creator = await new Promise((resolve, reject) => {
                if (!req.session.id) {
                    reject('');
                } else {
                    console.log('req.session.id:', req.session.id);
                    resolve(req.session.id);
                }
            });
            const test_user = 1;
            const ingredients = await Ingredient.getIngredientsByCreator(test_user);
            if (!ingredients) res.status(200).json({
                "status": "success",
                "message": "Ingredient query successfully",
            });
        } catch (error) {
            console.error(error);
            console.log('getIngredientsByCreator Error!!!');
        }
    }

}

module.exports = IngredientController;