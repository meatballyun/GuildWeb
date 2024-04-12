const Recipe = require('../models/recipeModel.js');
const RecipeIngredientRelation = require('../models/recipeIngredientRelationModel.js');
const Ingredient = require('../models/ingredientModel.js');

const UserInfoController = require('./userinfoControllers');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;

class RecipeController {
    async addRecipe(req, res) {
        try {        
            const CREATOR = req.session.passport.user;
            const newRecipe = await Recipe.addRecipe(CREATOR, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            const ingredients = req.body.ingredients;
            if (!ingredients?.length) res.status(404).json({
                    success: false,
                    message: "The requested resource was not found.",
                    data: "Not Found"
                });
            
            ingredients.map(async (ingredient)=>{
                await RecipeIngredientRelation.addRecipeIngredientRelation(ingredient.id, newRecipe['insertId'], ingredient.amount);
            });

            await updateUserExp(1, CREATOR);
            res.status(200).json({
                success: true,
                message: "Data uploaded successfully.",
                data: {
                    id: newRecipe['insertId']
                }
            });

        } catch (err) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
                data: "Bad Request"
            });
        }
    } 

    async updateRecipe(req, res) {
        try {
            const query = await Recipe.updateRecipe(req.body.id, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            if (!query?.length) res.status(404).json({
                success: false,
                message: "The requested resource was not found.",
                data: "Not Found"
            });
            const ingredients = req.body.ingredients;
            ingredients.map(async (ingredient)=>{
                const getIngredient = await RecipeIngredientRelation.getRecipeIngredientRelationByIngredientAndRecipe(ingredient.id, req.body.id);
                (getIngredient?.length) ? await RecipeIngredientRelation.updateRecipeIngredientRelation(ingredient.id, req.body.id, ingredient.amount) : await RecipeIngredientRelation.addRecipeIngredientRelation(ingredient.id, req.body.id, ingredient.amount);
            });
            
            res.status(200).json({
                success: true,
                message: "Data updated successfully.",
                data: {
                    id: req.body.id
                }
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
                data: "Bad Request"
            });
        }
    } 

    async getRecipes(req, res) {
        try {
            const CREATOR = req.session.passport.user;      
            const recipes = req.query.q ? await Recipe.getRecipesByCreatorAndName(CREATOR, req.query.q) : await Recipe.getRecipesByCreator(CREATOR);
            const data = recipes.map(row => ({
                id: row.ID,
                name: row.NAME,
                carbs: row.CARBS,
                pro: row.PRO,
                fats: row.FATS,
                kcal: row.KCAL,
                unit: row.UNIT,
                imageUrl: row.IMAGE_URL
            }));

            if (data) {
                res.status(200).json({
                    success: true,
                    message: "Data retrieval successful.",
                    data : data
                });
            } else{
                res.status(404).json({
                    success: false,
                    message: "The requested resource was not found.",
                    data : "Not Found"
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The request cannot be processed due to invalid information.",
                data: "Bad Request"
            });
        }
    }

    async getRecipeDetailById(req, res) {
        try {
            const [ recipes ] = await Recipe.getRecipesById(req.params.id);
            if (!recipes?.length) res.status(404).json({
                success: false,
                message: "The requested resource was not found.",
                data: "Not Found"
            });
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
                res.status(200).json({ 
                    success: true,
		            message: "Data retrieval successful.",
                    data : data
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The request cannot be processed due to invalid information.",
                data: "Bad Request"
            });
        }
    }

    async deleteRecipeById(req, res) {
        try {
            const query = await Recipe.deleteRecipesById(req.params.id);
            if (query?.length) {
                res.status(200).json({
                    success: true,
                    message: "The data with the specified object ID has been successfully deleted.",
                    data: "OK"
                });
            } else{
                res.status(404).json({
                success: false,
                    message: "The requested resource to delete was not found.",
                    data: "Not Found"
                })
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The request to delete the data was invalid.",
                data: "Bad Request"
            });
        }
    }

}

module.exports = RecipeController;