import { HttpResponse, http } from 'msw';
import { DAILY_FOOD, RECIPE } from './constants';
import { BASE_API_URL } from '../../../../api';

const BASE_URL = `${BASE_API_URL}/food`;

export const food = [
  http.get(`${BASE_URL}/recipe/:id`, async ({ params }) => {
    return new HttpResponse.json(RECIPE);
  }),
  http.get(`${BASE_URL}`, async ({ request }) => {
    const date = request.url.searchParams.get('date');
    if (!date)
      new HttpResponse.json({ message: 'date required' }, { status: 403 });
    return new HttpResponse.json(RECIPE);
  }),
  http.get(`${BASE_URL}/dietRecords`, async ({ request }) => {
    return  HttpResponse.json(DAILY_FOOD);
  }),
];
