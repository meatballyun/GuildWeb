const Recipe = require('../../models/recipeModel.js');
const RecipeIngredientRelation = require('../../models/recipeIngredientRelationModel.js');
const Ingredient = require('../../models/ingredientModel.js');
const UserInfoController = require('../user/userinfoControllers.js');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;
const ApplicationError = require('../../utils/error/applicationError.js');

class RecipeController {
    async getRecipes(req, res, next) {
        try {
            let recipes, data;
            if ( req.query.public ){
                recipes = req.query.q ? await Recipe.getRecipesByName(req.query.q) : await Recipe.getRecipes();
            } else {
                recipes = req.query.q ? await Recipe.getRecipesByCreatorAndName(req.session.passport.user, req.query.q) : await Recipe.getRecipesByCreator(req.session.passport.user);
            }
            data = recipes.map(row => ({
                id: row.ID,
                name: row.NAME,
                carbs: row.CARBS,
                pro: row.PRO,
                fats: row.FATS,
                kcal: row.KCAL,
                unit: row.UNIT,
                imageUrl: row.IMAGE_URL
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

    async getRecipeDetail(req, res, next) {
        try {
            const [ recipes ] = await Recipe.getRecipesById(req.params.id);
            if (!recipes) return next(new ApplicationError(404));

            const query = await RecipeIngredientRelation.getRecipeIngredientRelationByRecipe(req.params.id);
            const ingredients = await Promise.all(query.map( async(item)=>{
                const [ ingredient ] = await Ingredient.getIngredientsById(item.INGREDIENTS);
                return {
                    id: ingredient.ID,
                    name: ingredient.NAME,
                    carbs: ingredient.CARBS,
                    pro: ingredient.PRO,
                    fats: ingredient.FATS,
                    kcal: ingredient.KCAL,
                    unit: ingredient.UNIT,
                    imageUrl: ingredient.IMAGE_URL,
                    amount: item.AMOUNT,
                };
            }));

            const data = {
                name: recipes.NAME,
                description: recipes.DESCRIPTION,
                unit: recipes.UNIT,
                imageUrl: recipes.IMAGE_URL,
                ingredients: ingredients,
            };

            if (data) {
                return res.status(200).json({ 
                    success: true,
		            message: "Data retrieval successful.",
                    data : data
                });
            }
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async addRecipe(req, res, next) {
        try {        
            const newRecipe = await Recipe.addRecipe(req.session.passport.user, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            const ingredients = req.body.ingredients;
            if (!ingredients?.length) return next(new ApplicationError(404));
            
            ingredients.map(async (ingredient)=>{
                await RecipeIngredientRelation.addRecipeIngredientRelation(ingredient.id, newRecipe['insertId'], ingredient.amount);
            });

            await updateUserExp(1, req.session.passport.user);
            return res.status(200).json({
                success: true,
                message: "Data uploaded successfully.",
                data: {
                    id: newRecipe['insertId']
                }
            });

        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    } 

    async updateRecipe(req, res, next) {
        try {
            const query = await Recipe.updateRecipe(req.params.id, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            if (!query.affectedRows) return next(new ApplicationError(404));

            const ingredients = req.body.ingredients;
            ingredients.map(async (ingredient)=>{
                const getIngredient = await RecipeIngredientRelation.getRecipeIngredientRelationByIngredientAndRecipe(ingredient.id, req.params.id);
                (getIngredient?.length) ? await RecipeIngredientRelation.updateRecipeIngredientRelation(ingredient.id, req.params.id, ingredient.amount) : await RecipeIngredientRelation.addRecipeIngredientRelation(ingredient.id, req.body.id, ingredient.amount);
            });
            
            return res.status(200).json({
                success: true,
                message: "Data updated successfully.",
                data: {
                    id: req.params.id
                }
            });
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    } 

    async deleteRecipe(req, res, next) {
        try {
            const query = await Recipe.deleteRecipesById(req.params.id);
            if (query.changedRows) {
                return res.status(200).json({
                    success: true,
                    message: "The data with the specified object ID has been successfully deleted.",
                    data: "OK"
                });
            } else{
                return next(new ApplicationError(404));
            }
        } catch (error) {
            return next(new ApplicationError(400, err));
        }
    }

}

module.exports = RecipeController;