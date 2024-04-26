const Ingredient = require('../../models/ingredientModel.js');
const RecipeIngredientRelation = require('../../models/recipeIngredientRelationModel.js');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;
const ApplicationError = require('../../utils/error/applicationError.js');

class IngredientController {
    async getIngredients(req, res, next) {
        try {
            let ingredients, data;
            if ( req.query.public ){
                ingredients = req.query.q ? await Ingredient.getIngredientsByName(req.query.q) : await Ingredient.getIngredients();
            } else {
                ingredients = req.query.q ? await Ingredient.getIngredientsByCreatorAndName(req.session.passport.user, req.query.q) : await Ingredient.getIngredientsByCreator(req.session.passport.user);
            }
            data = ingredients.map(row => ({
                id: row.ID,
                name: row.NAME,
                carbs: row.CARBS,
                pro: row.PRO,
                fats: row.FATS,
                kcal: row.KCAL,
                unit: row.UNIT,
                imageUrl: row.IMAGE_URL,
            }));

            return res.status(200).json({
                success: true,
                message: "Data retrieval successful.",
                data : data 
            });
            
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async getIngredientDetail(req, res, next) {
        try {
            const [ ingredients ] = await Ingredient.getIngredientsById(req.params.id);
            const data = {
                name: ingredients.NAME,
                create_time: ingredients.CREATE_TIME,
                upload_time: ingredients.UPDATE_TIME,
                description: ingredients.DESCRIPTION,
                carbs: ingredients.CARBS,
                pro: ingredients.PRO,
                fats: ingredients.FATS,
                kcal: ingredients.KCAL,
                unit: ingredients.UNIT,
                imageUrl: ingredients.IMAGE_URL,
            };
            if (data) {
                return res.status(200).json({ 
                    success: true,
                    message: "Data retrieval successful.",
                    data : data
                });
            } else{
                return next(new ApplicationError(404));
            }
        } catch (err) {
            return next(new ApplicationError(404, err));
        }
    }

    async addIngredient(req, res, next) {
        try {      
            const newIngredient = await Ingredient.addIngredient(req.session.passport.user, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            if (newIngredient['insertId']){
                await updateUserExp(1, req.session.passport.user);
                return res.status(200).json(
                    {
                    "success": true,
                    "message": "Data uploaded successfully.",
                    "data": {
                        id: newIngredient['insertId']
                    }
                });
            }
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async updateIngredient(req, res, next) {
        try {
            const query = await Ingredient.updateIngredient(req.params.id, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            if (query.affectedRows) {
                return res.status(200).json({
                    success: true,
                    message: "Data updated successfully.",
                    data: {
                        id: req.params.id
                    }
                });
            } else{
                return next(new ApplicationError(404));            
            }
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async deleteIngredients(req, res, next) {
        try {
            const getIngredients = await RecipeIngredientRelation.getRecipeIngredientRelationByIngredient(req.params.id);
            if(getIngredients?.length){
                return next(new ApplicationError(409));
            }

            const query = await Ingredient.deleteIngredientsById(req.params.id);
            if (query.changedRows) {
                return res.status(200).json({
                    success: true,
                    message: "The data with the specified object ID has been successfully deleted.",
                    data: 'ok'
                });
            } else{
                return next(new ApplicationError(404));
            }
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }
    

}

module.exports = IngredientController;