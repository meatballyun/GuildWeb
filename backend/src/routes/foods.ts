import express from 'express';
import passport from '../utils/verification/passport';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { IngredientController } from '../controllers/food/ingredient';
import { RecipeController } from '../controllers/food/recipe';
import { DietRecordController } from '../controllers/food/dietRecord';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: true });

// ingredient
router.get('/ingredients', auth, awaitHandlerFactory(IngredientController.getIngredients));
router.get('/ingredients/:id', auth, awaitHandlerFactory(IngredientController.getIngredientDetail));
router.post('/ingredients', auth, awaitHandlerFactory(IngredientController.createIngredient));
router.put('/ingredients/:id', auth, awaitHandlerFactory(IngredientController.updateIngredient));
router.delete('/ingredients/:id', auth, awaitHandlerFactory(IngredientController.deleteIngredients));

// recipe
router.get('/recipes', auth, awaitHandlerFactory(RecipeController.getRecipes));
router.get('/recipes/:id', auth, awaitHandlerFactory(RecipeController.getRecipeDetail));
router.post('/recipes', auth, awaitHandlerFactory(RecipeController.createRecipe));
router.put('/recipes/:id', auth, awaitHandlerFactory(RecipeController.updateRecipe));
router.delete('/recipes/:id', auth, awaitHandlerFactory(RecipeController.deleteRecipe));

// dietRecord
router.get('/dietRecords', auth, awaitHandlerFactory(DietRecordController.getDietRecords));
router.post('/dietRecords', auth, awaitHandlerFactory(DietRecordController.createDietRecord));
router.delete('/dietRecords/:id', auth, awaitHandlerFactory(DietRecordController.deleteDietRecord));

export default router;
