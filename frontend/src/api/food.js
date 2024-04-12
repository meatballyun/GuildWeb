import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

const BASE_URL = `${BASE_API_URL}/food`;

export const getDietRecords = ({ params }) =>
  fetchJson({
    url: `${BASE_URL}/dietRecords?date=${params.date}`,
    method: 'GET',
  });

export const addDietRecords = ({ body }) =>
  fetchJson({
    url: `${BASE_URL}/dietRecords`,
    body,
    method: 'POST',
  });
export const deleteDietRecords = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_URL}/dietRecords/${pathParams.id}`,
    method: 'DELETE',
  });

/** Ingredient */
export const getIngredient = ({ params }) =>
  fetchJson({
    url: `${BASE_URL}/ingredient?q=${params.q}`,
    method: 'GET',
  });

export const getIngredientDetail = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_URL}/ingredient/${pathParams.id}`,
    method: 'GET',
  });
export const deleteIngredient = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_URL}/ingredient/${pathParams.id}`,
    method: 'DELETE',
  });

export const addNewIngredient = ({ body }) =>
  fetchJson({
    url: `${BASE_URL}/ingredient`,
    method: 'POST',
    body: body,
  });

export const editIngredientDetail = ({ body }) =>
  fetchJson({
    url: `${BASE_URL}/ingredient`,
    method: 'PUT',
    body: body,
  });

/** Recipe */
export const getRecipe = ({ params }) =>
  fetchJson({
    url: `${BASE_URL}/recipe?q=${params.q}`,
    method: 'GET',
  });

export const getRecipeDetail = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_URL}/recipe/${pathParams.id}`,
    method: 'GET',
  });

export const deleteRecipe = ({ pathParams }) =>
  fetchJson({
    url: `${BASE_URL}/recipe/${pathParams.id}`,
    method: 'DELETE',
  });

export const addNewRecipe = ({ body }) =>
  fetchJson({
    url: `${BASE_URL}/recipe`,
    method: 'POST',
    body: body,
  });

export const editRecipeDetail = ({ body }) =>
  fetchJson({
    url: `${BASE_URL}/recipe`,
    method: 'PUT',
    body: body,
  });
