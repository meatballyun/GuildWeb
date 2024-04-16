import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

export const getGuild = () =>
  fetchJson({ url: `${BASE_API_URL}/guild`, method: 'GET' });
