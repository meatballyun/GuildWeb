const Ingredient = require('../models/ingredientModel.js');
const UserInfoController = require('./userinfoControllers');
const ImageController = require('./imageControllers');
const userInfoController = new UserInfoController();
const imageController = new ImageController();
const updateUserExp = userInfoController.updateUserExp;
const saveImage = imageController.saveImage;
class IngredientController {
    async addNewIngredient(req, res) {
        try {
            const CREATOR = req.session.passport.user;
            let imagePath = 'no_image';
            if (req.body.imageUrl) imagePath = await saveImage(req, 'ingredient');       
            const newIngredient = await Ingredient.addIngredient(CREATOR, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, imagePath, req.body.public);
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
            let imagePath = 'no_image';
            if (req.body.imageUrl) imagePath = await saveImage(req, 'ingredient');
            await Ingredient.updateIngredient(req.body.id, req.body.name, req.body.description, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal, req.body.unit, imagePath, req.body.public);
            res.status(200).json({newId: req.body.id});
        } catch (err) {
            console.log('updateIngredient Error!!!', err);
            res.status(500).json({
                message: "error"
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
                imageUrl: row.IMAGE_URL,
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
                imageUrl: row.IMAGE_URL,
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