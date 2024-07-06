import { RowDataPacket } from 'mysql2';
import { CommonColumn } from '../common';
import { RecipeIngredientRelation } from './RecipeIngredientRelation';

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

export interface Ingredient extends BaseIngredient, CommonColumn {}

export interface IngredientWithAmount extends Pick<Ingredient, 'id' | 'carbs' | 'pro' | 'fats' | 'kcal' | 'imageUrl' | 'published' | 'unit'>, RowDataPacket {
  amount: RecipeIngredientRelation['amount'];
}
