import { RowDataPacket } from 'mysql2';

export interface BaseRecipeIngredientRelation {
  ingredientId: number;
  recipeId: number;
  amount: number;
}

export interface RecipeIngredientRelation extends RowDataPacket, BaseRecipeIngredientRelation {}
