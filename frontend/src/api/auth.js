import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

export const login = (body) =>
  fetchJson({ url: `${BASE_API_URL}/login`, method: 'POST', body });

export const signUp = (body) =>
  fetchJson({ url: `${BASE_API_URL}/signup`, method: 'POST', body });
