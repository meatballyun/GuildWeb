import { RowDataPacket } from 'mysql2';

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

export interface Ingredient extends BaseIngredient, RowDataPacket {
  id: number;
  createTime: Date;
  updateTime: Date;
  active: boolean;
}
