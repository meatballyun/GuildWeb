const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const ingredient = new (require('../controllers/food/ingredientControllers'))();
const recipe = new (require('../controllers/food/recipeControllers'))();
const dietRecord = new (require('../controllers/food/dietRecordControllers'))();

//ingredient
router.get('/ingredients', auth, ingredient.getIngredients);

router.get('/ingredients/:id', auth, ingredient.getIngredientDetail);

router.post('/ingredients', auth, ingredient.addIngredient);

router.put('/ingredients/:id', auth, ingredient.updateIngredient);

router.delete('/ingredients/:id', auth, ingredient.deleteIngredients);

//recipe
router.get('/recipes', auth, recipe.getRecipes);

router.get('/recipes/:id', auth, recipe.getRecipeDetail);

router.post('/recipes', auth, recipe.addRecipe);

router.put('/recipes/:id', auth, recipe.updateRecipe);

router.delete('/recipes/:id', auth, recipe.deleteRecipe);

//recor
router.get('/dietRecords', auth, dietRecord.getDietRecords);

router.post('/dietRecords', auth, dietRecord.addDietRecord);

router.delete('/dietRecords/:id', auth, dietRecord.deleteDietRecord);


module.exports = router;