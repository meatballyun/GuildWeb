import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

const BASE_URL = `${BASE_API_URL}/food`;

export const dietRecords = (params) =>
  fetchJson({ url: `${BASE_URL}/dietRecords?date=${params.date}`, method: 'GET' });

export const ingredient = (body) =>
  fetchJson({ url: `${BASE_URL}/ingredient`, method: 'POST', body });
