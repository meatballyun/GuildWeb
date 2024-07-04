import express from 'express';
import {
  getIngredients,
  getIngredientDetail,
  createIngredient,
  updateIngredient,
  deleteIngredients,
  getRecipes,
  getRecipeDetail,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getDietRecords,
  createDietRecord,
  deleteDietRecord,
} from '../controllers';
import { verifyToken } from '../utils/verification';

const router = express.Router();

// ingredient
router.get('/ingredients', verifyToken, getIngredients);
router.get('/ingredients/:id', verifyToken, getIngredientDetail);
router.post('/ingredients', verifyToken, createIngredient);
router.put('/ingredients/:id', verifyToken, updateIngredient);
router.delete('/ingredients/:id', verifyToken, deleteIngredients);

// recipe
router.get('/recipes', verifyToken, getRecipes);
router.get('/recipes/:id', verifyToken, getRecipeDetail);
router.post('/recipes', verifyToken, createRecipe);
router.put('/recipes/:id', verifyToken, updateRecipe);
router.delete('/recipes/:id', verifyToken, deleteRecipe);

// dietRecord
router.get('/dietRecords', verifyToken, getDietRecords);
router.post('/dietRecords', verifyToken, createDietRecord);
router.delete('/dietRecords/:id', verifyToken, deleteDietRecord);

export default router;
