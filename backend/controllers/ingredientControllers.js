const Ingredient = require('../models/ingredientModel.js');
const RecipeIngredientRelation = require('../models/recipeIngredientRelationModel.js');
const UserInfoController = require('./userinfoControllers');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;

class IngredientController {
    async addIngredient(req, res) {
        try {
            const CREATOR = req.session.passport.user;      
            const newIngredient = await Ingredient.addIngredient(CREATOR, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            await updateUserExp(1, CREATOR);
            res.status(200).json({newId: newIngredient['insertId']});
        } catch (err) {
            console.log('addIngredient Error!!!', err);
            res.status(500).json({
                message: "error"
            });
        }
    }

    async updateIngredient(req, res) {
        try {
            await Ingredient.updateIngredient(req.body.id, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            res.status(200).json({id: req.body.id});
        } catch (err) {
            console.log('updateIngredient Error!!!', err);
            res.status(500).json({
                message: "error"
            });
        }
    }

    async getIngredients(req, res) {
        try {
            const CREATOR = req.session.passport.user;   
            const ingredients = req.query.q ? await Ingredient.getIngredientsByCreatorAndName(CREATOR, req.query.q) : await Ingredient.getIngredientsByCreator(CREATOR);
            const data = ingredients.map(row => ({
                id: row.ID,
                name: row.NAME,
                carbs: row.CARBS,
                pro: row.PRO,
                fats: row.FATS,
                kcal: row.KCAL,
                unit: row.UNIT,
                imageUrl: row.IMAGE_URL,
            }));
            if (data) {
                return res.status(200).json({ data : data });
            }
        } catch (error) {
            console.error(error);
            console.log('getIngredients Error!!!');
        }
    }

    async getIngredientDetailById(req, res) {
        try {
            const [ ingredients ] = await Ingredient.getIngredientsById(req.params.id);
            const data = {
                id: ingredients.ID,
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
                return res.status(200).json({ data : data});
            }
        } catch (error) {
            console.error(error);
            console.log('getIngredientsByCreator Error!!!');
        }
    }

    async deleteIngredientsById(req, res) {
        try {
            const getIngredients = await RecipeIngredientRelation.getRecipeIngredientRelationByIngredient(req.params.id);
            if(getIngredients?.length){
                return res.status(409).json({message: "This resource is referenced by other entities and cannot be deleted."});
            }

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