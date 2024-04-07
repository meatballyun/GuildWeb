const Ingredient = require('../models/ingredientModel.js');
const UserInfoController = require('./userinfoControllers');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;
class IngredientController {
    async addNewIngredient(req, res) {
        try {
            const CREATOR = req.session.passport.user;
            await Ingredient.addIngredient(CREATOR, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, 'imgUrl', req.body.public);
            await this.updateUserExp(CREATOR, 1);
            res.status(200).json({                
                "status": "success",
                "message": "'addNewIngredient' successfully. 'updateUserExp' : 1 exp.",
            });
        } catch (error) {
            console.error(error);
            console.log('addIngredient Error!!!');
            res.status(500).json({
                "status": "error",
                "message": "An error occurred while adding new ingredient.",
            });
        }
    }

    async getIngredientsByCreator(req, res) {
        try {
            const CREATOR = req.session.passport.user;   
            const ingredients = req.query.q ? await Ingredient.getIngredientsByCreatorAndName(CREATOR, req.query.q) : await Ingredient.getIngredientsByCreator(CREATOR);
            const data = ingredients.map(row => ({
                id: row.ID,
                name: row.NAME,
                create_time: row.CREATE_TIME,
                upload_time: row.UPDATE_TIME,
                description: row.DESCRIPTION,
                carbs: row.CARBS,
                pro: row.PRO,
                fats: row.FATS,
                kacl: row.KCAL,
                unit: row.UNIT,
                image_url: row.IMAGE_URL,
                published: row.PUBLISHED
            }));
            if (data) {
                return res.status(200).json({ data });
            }
        } catch (error) {
            console.error(error);
            console.log('getIngredientsByCreator Error!!!');
        }
    }

    async getIngredientDetailById(req, res) {
        try {
            const ingredients = await Ingredient.getIngredientsById(req.params.id);
            const data = ingredients.map(row => ({
                id: row.ID,
                name: row.NAME,
                create_time: row.CREATE_TIME,
                upload_time: row.UPDATE_TIME,
                description: row.DESCRIPTION,
                carbs: row.CARBS,
                pro: row.PRO,
                fats: row.FATS,
                kacl: row.KCAL,
                unit: row.UNIT,
                image_url: row.IMAGE_URL,
            }));
            console.log(data);
            if (data) {
                return res.status(200).json(data[0]);
            }
        } catch (error) {
            console.error(error);
            console.log('getIngredientsByCreator Error!!!');
        }
    }

    async deleteIngredientsById(req, res) {
        try {
            const query = await Ingredient.deleteIngredientsById(req.params.id);
            if (query) {
                return res.status(200).json({data: 'ok'});
            }
        } catch (error) {
            console.error(error);
            console.log('getIngredientsByCreator Error!!!');
        }
    }
    

}

module.exports = IngredientController;