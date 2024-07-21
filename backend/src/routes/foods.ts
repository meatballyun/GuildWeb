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
import { verifyToken } from '../utils/token/verification';

const router = express.Router();

// ingredient //id: Ingredient ID
// Get all ingredients for the user.
router.get('/ingredients', verifyToken, getIngredients);

// Get the specified ingredient.
router.get('/ingredients/:id', verifyToken, getIngredientDetail);

// Create ingredient.
router.post('/ingredients', verifyToken, createIngredient);

// Update ingredient.
router.put('/ingredients/:id', verifyToken, updateIngredient);

// Remove ingredient.
router.delete('/ingredients/:id', verifyToken, deleteIngredients);

// recipe //id: Recipe ID
// Get all recipes for the user.
router.get('/recipes', verifyToken, getRecipes);

// Get the specified recipe.
router.get('/recipes/:id', verifyToken, getRecipeDetail);

// Create recipe.
router.post('/recipes', verifyToken, createRecipe);

// Update recipe.
router.put('/recipes/:id', verifyToken, updateRecipe);

// Remove recipe.
router.delete('/recipes/:id', verifyToken, deleteRecipe);

// dietRecord //id: DietRecord ID
// Retrieve the DietRecord for the specified date
router.get('/dietRecords', verifyToken, getDietRecords);

// Create dietRecord.
router.post('/dietRecords', verifyToken, createDietRecord);

// Remove dietRecord.
router.delete('/dietRecords/:id', verifyToken, deleteDietRecord);

export default router;
