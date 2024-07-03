import express from 'express';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { IngredientController } from '../controllers/food/ingredient';
import { RecipeController } from '../controllers/food/recipe';
import { DietRecordController } from '../controllers/food/dietRecord';
import { verifyToken } from '../utils/verification';

const router = express.Router();

// ingredient
router.get('/ingredients', verifyToken, awaitHandlerFactory(IngredientController.getIngredients));
router.get('/ingredients/:id', verifyToken, awaitHandlerFactory(IngredientController.getIngredientDetail));
router.post('/ingredients', verifyToken, awaitHandlerFactory(IngredientController.createIngredient));
router.put('/ingredients/:id', verifyToken, awaitHandlerFactory(IngredientController.updateIngredient));
router.delete('/ingredients/:id', verifyToken, awaitHandlerFactory(IngredientController.deleteIngredients));

// recipe
router.get('/recipes', verifyToken, awaitHandlerFactory(RecipeController.getRecipes));
router.get('/recipes/:id', verifyToken, awaitHandlerFactory(RecipeController.getRecipeDetail));
router.post('/recipes', verifyToken, awaitHandlerFactory(RecipeController.createRecipe));
router.put('/recipes/:id', verifyToken, awaitHandlerFactory(RecipeController.updateRecipe));
router.delete('/recipes/:id', verifyToken, awaitHandlerFactory(RecipeController.deleteRecipe));

// dietRecord
router.get('/dietRecords', verifyToken, awaitHandlerFactory(DietRecordController.getDietRecords));
router.post('/dietRecords', verifyToken, awaitHandlerFactory(DietRecordController.createDietRecord));
router.delete('/dietRecords/:id', verifyToken, awaitHandlerFactory(DietRecordController.deleteDietRecord));

export default router;
