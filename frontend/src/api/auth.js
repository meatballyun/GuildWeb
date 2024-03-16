import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

export const login = (body) =>
  fetchJson({ url: `${BASE_API_URL}/login`, method: 'POST', body });

export const checkAuth = (token) =>
  fetchJson({ url: `${BASE_API_URL}/checkAuth`, method: 'GET', headers: { Authorization: `Bearer ${token}` }});

export const signUp = (body) =>
  fetchJson({ url: `${BASE_API_URL}/signup`, method: 'POST', body });

export const ingredient = (body) =>
  fetchJson({ url: `${BASE_API_URL}/ingredient`, method: 'POST', body });