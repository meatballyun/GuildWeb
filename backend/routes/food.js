const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const IngredientController = require('../controllers/ingredientControllers');
const RecipeController = require('../controllers/recipeControllers');
const DietRecordController = require('../controllers/dietRecordControllers');
const ingredient = new IngredientController();
const recipe = new RecipeController();
const dietRecord = new DietRecordController();

//ingredient
router.post('/ingredient', auth, ingredient.addIngredient);
router.put('/ingredient', auth, ingredient.updateIngredient);
router.get('/ingredient', auth, ingredient.getIngredients);
router.get('/ingredient/:id', auth, ingredient.getIngredientDetailById);
router.delete('/ingredient/:id', auth, ingredient.deleteIngredientsById);

//recipe
router.post('/recipe', auth, recipe.addRecipe);
router.put('/recipe', auth, recipe.updateRecipe);
router.get('/recipe', auth, recipe.getRecipes);
router.get('/recipe/:id', auth, recipe.getRecipeDetailById);
router.delete('/recipe/:id', auth, recipe.deleteRecipeById);
//recor
router.post('/dietRecords', auth, dietRecord.addDietRecord);
router.get('/dietRecords', auth, dietRecord.getDietRecord);
router.delete('/dietRecords/:id', auth, dietRecord.deleteDietRecord);

module.exports = router;