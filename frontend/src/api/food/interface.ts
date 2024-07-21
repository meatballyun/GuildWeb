import { CommonColumn } from '../interface';

export type Category = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'supper';

export interface FoodNutation {
  carbs: number;
  pro: number;
  fats: number;
  kcal: number;
}

export interface BaseIngredient {
  name: string;
  creatorId?: number;
  description?: string;
  carbs: number;
  pro: number;
  fats: number;
  kcal: number;
  unit: string;
  imageUrl?: string;
  published?: boolean;
}

export interface Ingredient extends BaseIngredient, CommonColumn {
  isOwned: boolean;
}

export interface BaseRecipe {
  name: string;
  creatorId?: number;
  description?: string;
  carbs: number;
  pro: number;
  fats: number;
  kcal: number;
  unit: string;
  imageUrl?: string;
  published?: boolean;
}

export interface RecipeIngredient extends Ingredient {
  amount: number;
}

export interface Recipe extends BaseRecipe, CommonColumn {
  isOwned: boolean;
  ingredients: RecipeIngredient[];
}

export interface dietRecipe {
  amount: number;
  carbs: number;
  category: Category;
  fats: number;
  id: number;
  imageUrl: null;
  kcal: number;
  name: string;
  pro: number;
  recipeId: number;
  unit: string;
}

export interface DailyRecord {
  target: FoodNutation;
  foods: dietRecipe[];
}
