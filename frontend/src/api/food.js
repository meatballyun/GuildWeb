import { BASE_API_URL } from './constants';
import { fetchJson } from './utils';

const BASE_URL = `${BASE_API_URL}/foods`;

// ------------- DietRecords ------------- //
export const getDietRecords = ({ params = { date: '' } }) =>
  fetchJson({
    url: `${BASE_URL}/dietRecords?date=${params.date}`,
    method: 'GET',
  });

export const postDietRecords = ({ body }) =>
  fetchJson({
    url: `${BASE_URL}/dietRecords`,
    body,
    method: 'POST',
  });

export const deleteDietRecords = ({ pathParams = { id: -1 } }) =>
  fetchJson({
    url: `${BASE_URL}/dietRecords/${pathParams.id}`,
    method: 'DELETE',
  });

// ------------- Ingredients ------------- //
export const getIngredients = ({ params = { id: -1 } }) =>
  fetchJson({
    url: `${BASE_URL}/ingredients?q=${params.q}`,
    method: 'GET',
  });

export const postIngredients = ({ body }) =>
  fetchJson({
    url: `${BASE_URL}/ingredients`,
    method: 'POST',
    body: body,
  });

export const putIngredients = ({ pathParams = { id: -1 }, body }) =>
  fetchJson({
    url: `${BASE_URL}/ingredients/${pathParams.id}`,
    method: 'PUT',
    body: body,
  });

export const getIngredientsDetail = ({ pathParams = { id: -1 } }) =>
  fetchJson({
    url: `${BASE_URL}/ingredients/${pathParams.id}`,
    method: 'GET',
  });

export const deleteIngredients = ({ pathParams = { id: -1 } }) =>
  fetchJson({
    url: `${BASE_URL}/ingredients/${pathParams.id}`,
    method: 'DELETE',
  });

// ------------- Recipes ------------- //
export const getRecipes = ({ params = { q: '' } }) =>
  fetchJson({
    url: `${BASE_URL}/recipes?q=${params.q}`,
    method: 'GET',
  });

export const getRecipesDetail = ({ pathParams = { id: -1 } }) =>
  fetchJson({
    url: `${BASE_URL}/recipes/${pathParams.id}`,
    method: 'GET',
  });

export const postRecipes = ({ body }) =>
  fetchJson({
    url: `${BASE_URL}/recipes`,
    method: 'POST',
    body: body,
  });

export const putRecipes = ({ pathParams = { id: -1 }, body }) =>
  fetchJson({
    url: `${BASE_URL}/recipes/${pathParams.id}`,
    method: 'PUT',
    body: body,
  });

export const deleteRecipes = ({ pathParams = { id: -1 } }) =>
  fetchJson({
    url: `${BASE_URL}/recipes/${pathParams.id}`,
    method: 'DELETE',
  });
