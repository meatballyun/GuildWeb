import { auth } from './auth';
import { food } from './food';
import { guild } from './guild';

export const routes = [...auth, ...food, ...guild];
