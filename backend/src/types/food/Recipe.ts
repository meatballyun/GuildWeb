import { CommonColumn } from '../common';

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

export interface Recipe extends BaseRecipe, CommonColumn {}
