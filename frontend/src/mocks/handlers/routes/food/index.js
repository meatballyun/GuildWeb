import { HttpResponse, delay, http } from 'msw';
import { DAILY_FOOD, INGREDIENT_LIST, RECIPE } from './constants';
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
  http.get(`${BASE_URL}/dietRecords`, async () => {
    return HttpResponse.json(DAILY_FOOD);
  }),
  http.get(`${BASE_URL}/ingredient`, async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    console.log(q);
    await delay(300);
    return HttpResponse.json(
      INGREDIENT_LIST.filter(({ name }) =>
        name.toLocaleLowerCase().includes(q.toLocaleLowerCase())
      )
    );
  }),
];
