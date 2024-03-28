import { HttpResponse, http } from 'msw';
import { RECIPE } from './constants';
import { BASE_API_URL } from '../../../../api';

const baseUrl = `${BASE_API_URL}/food`;

export const food = [
  http.get(`${baseUrl}/recipe/:id`, async ({ params }) => {
    return new HttpResponse.json(RECIPE);
  }),
  http.get(`${baseUrl}`, async ({ request }) => {
    const date = request.url.searchParams.get('date');
    if (!date)
      new HttpResponse.json({ message: 'date required' }, { status: 403 });
    return new HttpResponse.json(RECIPE);
  }),
];
