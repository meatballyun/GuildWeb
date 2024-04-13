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
            return res.status(200).json(
                {
                "success": true,
                "message": "Data uploaded successfully.",
                "data": {
                    id: newIngredient['insertId']
                }
            });
        } catch (err) {
            return res.status(400).json(
                {
                "success": false,
                "message": "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
                "data": "Bad Request"
              }
            );
        }
    }

    async updateIngredient(req, res) {
        try {
            const query = await Ingredient.updateIngredient(req.body.id, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, req.body.imageUrl, req.body.public);
            if (query.affectedRows) {
                return res.status(200).json({
                    success: true,
                    message: "Data updated successfully.",
                    data: {
                        id: req.body.id
                    }
                });
            } else{
                return res.status(404).json({
                    success: false,
                    message: "The requested resource was not found.",
                    data: "Not Found"
                });                
            }
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
                data: "Bad Request"
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
                return res.status(200).json({
                    success: true,
                    message: "Data retrieval successful.",
                    data : data 
                });
            } else {
				return res.status(404).json({
                    success: false,
                    message: "The requested resource was not found.",
                    data: "Not Found"
                })
			}
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: The request cannot be processed due to invalid information.",
          			data: "Bad Request"
            })
        }
    }

    async getIngredientDetailById(req, res) {
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
                return res.status(404).json({
                    success: false,
                    message: "The requested resource was not found.",
                    data: "Not Found"
                })
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: The request cannot be processed due to invalid information.",
          			data: "Bad Request"
            })
        }
    }

    async deleteIngredientsById(req, res) {
        try {
            const getIngredients = await RecipeIngredientRelation.getRecipeIngredientRelationByIngredient(req.params.id);
            if(getIngredients?.length){
                return res.status(409).json({
                    success: false,
                    message: "This resource is referenced by other entities and cannot be deleted.",
                    data: 'Conflict'
                });
            }

            const query = await Ingredient.deleteIngredientsById(50);
            if (query.changedRows) {
                return res.status(200).json({
                    success: true,
                    message: "The data with the specified object ID has been successfully deleted.",
                    data: 'ok'
                });
            } else{
                return res.status(404).json({
                    success: true,
                    message: "The requested resource to delete was not found.",
                    data: 'Not Found'
                });
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: The request to delete the data was invalid.",
                data: "Bad Request"
            });
        }
    }
    

}

module.exports = IngredientController;