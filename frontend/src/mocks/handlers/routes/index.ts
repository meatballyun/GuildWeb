import { auth } from './auth';
import { food } from './food';
import { guild } from './guild';
import { notifications } from './notification';

export const routes = [...auth, ...food, ...guild, ...notifications];
