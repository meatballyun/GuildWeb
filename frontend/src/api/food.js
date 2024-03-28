import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

const BASE_URL = `${BASE_API_URL}/food`;

export const ingredient = (body) =>
  fetchJson({ url: `${BASE_URL}/ingredient`, method: 'POST', body });
