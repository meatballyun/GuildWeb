import { HttpResponse, http } from 'msw';
import { RECIPE } from './constants';

export const food = [
  http.get('/food/recipe/:id', async (req, res, ctx) => {
    return new HttpResponse.json(RECIPE);
  }),
];
