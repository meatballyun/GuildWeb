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
  id: number;
  amount: number;
  category: Category;
  recipe: Recipe;
}

export interface DailyRecord {
  target: FoodNutation;
  foods: dietRecipe[];
}
