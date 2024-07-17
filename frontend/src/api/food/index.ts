import { baseInstance } from '../instance';
import { APIRequestConfig, APIResponseData } from '../interface';
import type {
  BaseIngredient,
  BaseRecipe,
  DailyRecord,
  Ingredient,
  Recipe,
} from './interface';

// ------------- DietRecords ------------- //
export const getDietRecords = async ({
  params,
}: APIRequestConfig<{ date: string }>) => {
  const url = `/foods/dietRecords`;
  const res = await baseInstance.get<APIResponseData<DailyRecord>>(url, {
    params,
  });
  return res.data.data;
};

export const postDietRecords = async ({
  data,
}: APIRequestConfig<
  never,
  {
    date: string;
    category: string;
    recipe: number;
    amount: number;
  }
>) => {
  const url = `/foods/dietRecords`;
  const res = await baseInstance.post<APIResponseData>(url, data);
  return res.data.data;
};

export const deleteDietRecords = async ({
  pathParams,
}: APIRequestConfig<never, never, { id: number }>) => {
  const url = `/foods/dietRecords/${pathParams}`;
  const res = await baseInstance.delete<APIResponseData>(url);
  return res.data.data;
};

// ------------- Ingredients ------------- //
export const getIngredients = async ({
  params,
}: APIRequestConfig<{ q: string; published?: boolean }>) => {
  const url = `/foods/ingredients`;
  const res = await baseInstance.get<APIResponseData<Ingredient[]>>(url, {
    params,
  });
  return res.data.data;
};

export const postIngredients = async ({
  data,
}: APIRequestConfig<never, BaseIngredient>) => {
  const url = `/foods/ingredients`;
  const res = await baseInstance.post<APIResponseData<{ id: number }>>(
    url,
    data
  );
  return res.data.data;
};

export const putIngredients = async ({
  pathParams,
  data,
}: APIRequestConfig<never, BaseIngredient, { id: string }>) => {
  const url = `/foods/ingredients/${pathParams?.id}`;
  const res = await baseInstance.put<APIResponseData<{ id: number }>>(
    url,
    data
  );
  return res.data.data;
};

export const getIngredientsDetail = async ({
  pathParams,
}: APIRequestConfig<never, BaseIngredient, { id: string }>) => {
  const url = `/foods/ingredients/${pathParams?.id}`;
  const res = await baseInstance.get<APIResponseData<Ingredient>>(url);
  return res.data.data;
};

export const deleteIngredients = async ({
  pathParams,
}: APIRequestConfig<never, never, { id: number }>) => {
  const url = `/foods/ingredients/${pathParams?.id}`;
  const res = await baseInstance.delete<APIResponseData<Ingredient>>(url);
  return res.data.data;
};

// ------------- Recipes ------------- //
export const getRecipes = async ({
  params,
}: APIRequestConfig<{ q: string; published?: boolean }>) => {
  const url = `/foods/recipes`;
  const res = await baseInstance.get<APIResponseData<Recipe[]>>(url, {
    params,
  });
  return res.data.data;
};

export const getRecipesDetail = async ({
  pathParams,
}: APIRequestConfig<never, never, { id: string }>) => {
  const url = `/foods/recipes/${pathParams?.id}`;
  const res = await baseInstance.get<APIResponseData<Recipe>>(url);
  return res.data.data;
};

export const postRecipes = async ({
  data,
}: APIRequestConfig<never, BaseRecipe>) => {
  const url = `/foods/recipes`;
  const res = await baseInstance.post<APIResponseData<Recipe>>(url, data);
  return res.data.data;
};

export const putRecipes = async ({
  pathParams,
  data,
}: APIRequestConfig<never, BaseRecipe, { id: number }>) => {
  const url = `/foods/recipes/${pathParams?.id}`;
  const res = await baseInstance.put<APIResponseData<Recipe>>(url, data);
  return res.data.data;
};

export const deleteRecipes = async ({
  pathParams = { id: -1 },
}: APIRequestConfig<never, never, { id: number }>) => {
  const url = `/foods/recipes/${pathParams?.id}`;
  const res = await baseInstance.delete<APIResponseData<Recipe>>(url);
  return res.data.data;
};
