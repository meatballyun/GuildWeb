import { CommonColumn } from '../common';

export type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'supper';

export interface BaseDietRecipe {
  name: string;
  creatorId?: number;
  dietDate: Date;
  category: Category;
  recipeId: number;
  carbs: number;
  pro: number;
  fats: number;
  kcal: number;
  amount: number;
}

export interface DietRecipe extends BaseDietRecipe, CommonColumn {}
