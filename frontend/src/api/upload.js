import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

export const uploadImage = ({ body }) =>
  fetchJson({
    url: `${BASE_API_URL}/upload/images`,
    method: 'POST',
    body,
  });
