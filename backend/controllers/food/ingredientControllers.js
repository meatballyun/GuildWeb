const Ingredient = require('../../models/ingredientModel.js');
const Recipe = require('../../models/recipeModel.js');
const RecipeIngredientRelation = require('../../models/recipeIngredientRelationModel.js');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;
const ApplicationError = require('../../utils/error/applicationError.js');

class IngredientController {
    async getIngredients(req, res, next) {
        try {
            let ingredients, data;
            ingredients = req.query.q ? await Ingredient.getIngredientsByCreatorAndName(req.session.passport.user, req.query.q) : await Ingredient.getIngredientsByCreator(req.session.passport.user);
            
            if (req.query.published){
                const publicIngredients = req.query.q ? await Ingredient.getIngredientsByName(req.session.passport.user, req.query.q) : await Ingredient.getIngredients(req.session.passport.user);
                ingredients.push(...publicIngredients);
            }

            data = ingredients.map(row => ({
                id: row.ID,
                isOwned: row.CREATOR === req.session.passport.user,                
                published: row.PUBLISHED,
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
                isOwned: ingredients.CREATOR === req.session.passport.user,
                published: ingredients.PUBLISHED,
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
            const newIngredient = await Ingredient.addIngredient(req.session.passport.user, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.published);
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
            const relations = await RecipeIngredientRelation.getRecipeIngredientRelationByIngredient(req.params.id);
            if(relations?.length && !req.body.published){
                for (const relation of relations) {
                    const [recipe] = await Recipe.getRecipesById(relation.RECIPES);
                    if (recipe.PUBLISHED) return next(new ApplicationError(409, "Unable to set ingredient as private. It is referenced by a public recipe."));
                }
            }

            const query = await Ingredient.updateIngredient(req.params.id, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.published);
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
            const relations = await RecipeIngredientRelation.getRecipeIngredientRelationByIngredient(req.params.id);
            if(relations?.length){
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