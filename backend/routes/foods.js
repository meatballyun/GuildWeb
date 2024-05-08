const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const awaitHandlerFactory = require('../utils/awaitHandlerFactory');
const ingredient = require('../controllers/food/ingredientControllers');
const recipe = require('../controllers/food/recipeControllers');
const dietRecord = require('../controllers/food/dietRecordControllers');

// ingredient
router.get('/ingredients', auth, awaitHandlerFactory(ingredient.getIngredients));
router.get('/ingredients/:id', auth, awaitHandlerFactory(ingredient.getIngredientDetail));
router.post('/ingredients', auth, awaitHandlerFactory(ingredient.createIngredient));
router.put('/ingredients/:id', auth, awaitHandlerFactory(ingredient.updateIngredient));
router.delete('/ingredients/:id', auth, awaitHandlerFactory(ingredient.deleteIngredients));

// recipe
router.get('/recipes', auth, awaitHandlerFactory(recipe.getRecipes));
router.get('/recipes/:id', auth, awaitHandlerFactory(recipe.getRecipeDetail));
router.post('/recipes', auth, awaitHandlerFactory(recipe.createRecipe));
router.put('/recipes/:id', auth, awaitHandlerFactory(recipe.updateRecipe));
router.delete('/recipes/:id', auth, awaitHandlerFactory(recipe.deleteRecipe));

// dietRecord
router.get('/dietRecords', auth, awaitHandlerFactory(dietRecord.getDietRecords));
router.post('/dietRecords', auth, awaitHandlerFactory(dietRecord.createDietRecord));
router.delete('/dietRecords/:id', auth, awaitHandlerFactory(dietRecord.deleteDietRecord));

module.exports = router;
