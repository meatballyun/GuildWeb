import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

const BASE_URL = `${BASE_API_URL}/food`;

export const getDietRecords = ({ params }) =>
  fetchJson({
    url: `${BASE_URL}/dietRecords?date=${params.date}`,
    method: 'GET',
  });

export const getIngredient = ({ params }) =>
  fetchJson({
    url: `${BASE_URL}/ingredient?q=${params.q}`,
    method: 'GET',
  });
