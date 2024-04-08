import { HttpResponse, delay, http } from 'msw';
import {
  DAILY_FOOD,
  INGREDIENT,
  INGREDIENT_LIST,
  RECIPE,
  RECIPE_LIST,
} from './constants';
import { BASE_API_URL } from '../../../../api';

const BASE_URL = `${BASE_API_URL}/food`;

export const food = [
  http.get(`${BASE_URL}`, async ({ request }) => {
    const date = request.url.searchParams.get('date');
    if (!date)
      new HttpResponse.json({ message: 'date required' }, { status: 403 });
    return new HttpResponse.json(RECIPE);
  }),
  http.get(`${BASE_URL}/dietRecords`, async () => {
    return HttpResponse.json(DAILY_FOOD);
  }),
  /* ------------ ingredient ------------ */
  http.get(`${BASE_URL}/ingredient`, async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    await delay(300);
    return HttpResponse.json({
      data: INGREDIENT_LIST.filter(({ name }) =>
        name.toLocaleLowerCase().includes(q.toLocaleLowerCase())
      ),
    });
  }),
  http.get(`${BASE_URL}/ingredient/:id`, async ({ params }) => {
    // console.log(params.id);
    await delay(300);
    return HttpResponse.json({ data: INGREDIENT });
  }),
  http.post(`${BASE_URL}/ingredient`, async () => {
    return HttpResponse.json({ newId: 23 });
  }),
  http.put(`${BASE_URL}/ingredient`, async () => {
    return HttpResponse.json({ editId: 23 });
  }),

  /* ------------ recipe ------------ */
  http.get(`${BASE_URL}/recipe`, async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    await delay(300);
    return HttpResponse.json({
      data: RECIPE_LIST.filter(({ name }) =>
        name.toLocaleLowerCase().includes(q.toLocaleLowerCase())
      ),
    });
  }),
  http.get(`${BASE_URL}/recipe/:id`, async ({ params }) => {
    // console.log(params.id);
    await delay(300);
    return HttpResponse.json(RECIPE);
  }),
  http.post(`${BASE_URL}/recipe`, async () => {
    return HttpResponse.json({ newId: 23 });
  }),
  http.put(`${BASE_URL}/recipe`, async () => {
    return HttpResponse.json({ editId: 23 });
  }),
];
