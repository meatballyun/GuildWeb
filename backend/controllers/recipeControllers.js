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
            ingredients.map(async (ingredient)=>{
                await RecipeIngredientRelation.addRecipeIngredientRelation(ingredient.id, newRecipe['insertId'], ingredient.count);
            });
            await updateUserExp(1, CREATOR);
            console.log(newRecipe);
            res.status(200).json({newId: newRecipe['insertId']});
        } catch (err) {
            console.log('addIngredient Error!!!', err);
            res.status(500).json({
                message: "error"
            });
        }
    } 

    async updateRecipe(req, res) {
        try {        
            await Recipe.updateRecipe(req.body.id, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            const ingredients = req.body.ingredients;
            ingredients.map(async (ingredient)=>{
                const getIngredient = await RecipeIngredientRelation.getRecipeIngredientRelationByIngredientAndRecipe(ingredient.id, req.body.id);
                (getIngredient?.length) ? await RecipeIngredientRelation.updateRecipeIngredientRelation(ingredient.id, req.body.id, ingredient.count) : await RecipeIngredientRelation.addRecipeIngredientRelation(ingredient.id, req.body.id, ingredient.count);
            });
            
            res.status(200).json({id: req.body.id});
        } catch (err) {
            console.log('addIngredient Error!!!', err);
            res.status(500).json({
                message: "error"
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
                description: row.DESCRIPTION,                
                carbs: row.CARBS,
                pro: row.PRO,
                fats: row.FATS,
                kcal: row.KCAL,
                unit: row.UNIT,
                imageUrl: row.IMAGE_URL
            }));
            if (data) {
                return res.status(200).json({ data : data });
            }
        } catch (error) {
            console.error(error);
            console.log('getRecipe Error!!!');
        }
    }

    async getRecipeDetailById(req, res) {
        try {
            const [ recipes ] = await Recipe.getRecipesById(req.params.id);
            const query = await RecipeIngredientRelation.getRecipeIngredientRelationByRecipe(req.params.id);
            console.log(query);
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
                    count: item.AMOUNT,
                };
            }));
            const data = {
                id: recipes.ID,
                name: recipes.NAME,
                description: recipes.DESCRIPTION,
                unit: recipes.UNIT,
                imageUrl: recipes.IMAGE_URL,
                ingredients: ingredients,
            };

            if (data) {
                return res.status(200).json({ data : data});
            }
        } catch (error) {
            console.error(error);
            console.log('getRecipeDetailById Error!!!');
        }
    }

    async deleteRecipeById(req, res) {
        try {
            await Recipe.deleteRecipesById(req.params.id);
            return res.status(200).json({data: 'ok'});
        } catch (error) {
            console.error(error);
            console.log('deleteRecipeById Error!!!');
        }
    }

}

module.exports = RecipeController;