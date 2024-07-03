import { CommonColumn } from '../interface';

export type Status =
  | 'confirmed'
  | 'pending response'
  | 'pending confirmation'
  | 'blocked';

export interface BaseUser {
  name: string;
  imageUrl: string;
  carbs: number;
  pro: number;
  fats: number;
  kcal: number;
}

export interface User extends BaseUser, CommonColumn {
  status: Status;
  email: string;
  password: string;
  rank: number;
  exp: number;
}

export interface UserMe extends User {
  upgradeExp: number;
}
