const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');

const IngredientController = require('../controllers/ingredientControllers');
const RecipeController = require('../controllers/recipeControllers');
const DietRecordController = require('../controllers/dietRecordControllers');

const ingredientController = new IngredientController();
const recipeController = new RecipeController();
const dietRecordController = new DietRecordController();

//ingredient
router.post('/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.addIngredient);
router.put('/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.updateIngredient);
router.get('/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.getIngredients);
router.get('/ingredient/:id', passport.authenticate('jwt', { session: true }), ingredientController.getIngredientDetailById);
router.delete('/ingredient/:id', passport.authenticate('jwt', { session: true }), ingredientController.deleteIngredientsById);

//recipe
router.post('/recipe', passport.authenticate('jwt', { session: true }), recipeController.addRecipe);
router.put('/recipe', passport.authenticate('jwt', { session: true }), recipeController.updateRecipe);
router.get('/recipe', passport.authenticate('jwt', { session: true }), recipeController.getRecipes);
router.get('/recipe/:id', passport.authenticate('jwt', { session: true }), recipeController.getRecipeDetailById);
router.delete('/recipe/:id', passport.authenticate('jwt', { session: true }), recipeController.deleteRecipeById);

//record
router.post('/dietRecords', passport.authenticate('jwt', { session: true }), dietRecordController.addDietRecord);
router.get('/dietRecords', passport.authenticate('jwt', { session: true }), dietRecordController.getDietRecord);
router.delete('/dietRecords/:id', passport.authenticate('jwt', { session: true }), dietRecordController.deleteDietRecord);

module.exports = router;