import { RowDataPacket } from 'mysql2';

export interface RecipeIngredientRelation extends RowDataPacket {
  ingredientId: number;
  recipeId: number;
  amount: number;
}
