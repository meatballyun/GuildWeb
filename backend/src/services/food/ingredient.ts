import { ApplicationError } from '../../utils/error/applicationError';
import { BaseIngredient } from '../../types/food/Ingredient';
import { TypeSearch } from '../../types/TypeSearch';
import { ingredientModel, recipeModel, recipeIngredientRelationModel } from '../../models';
import { executeTransaction } from '../../utils/executeTransaction';

export const getAll = async ({ q, published }: TypeSearch, uid: number) => {
  const ingredients = JSON.parse(published) ? await ingredientModel.getAllByName(q) : await ingredientModel.getAllByUserAndName(uid, q);
  const hasIngredients = ingredients?.length;
  if (hasIngredients) {
    const data = ingredients.map(({ creator, description, ...ingredient }) => ({
      ...ingredient,
      isOwned: creator === uid,
    }));
    return data;
  }
  return;
};

export const getOne = async (IngredientId: number, uid: number) => {
  const ingredient = await ingredientModel.getOne(IngredientId);
  if (!ingredient) throw new ApplicationError(404);
  return {
    isOwned: ingredient.creatorId === uid,
    ...ingredient,
  };
};

export const create = async (body: BaseIngredient, uid: number) => {
  const NewIngredientId = await ingredientModel.create(body, uid);
  if (!NewIngredientId) throw new ApplicationError(400);
  return { id: NewIngredientId };
};

export const update = async (ingredientId: number, body: BaseIngredient, uid: number) => {
  const originIngredient = await ingredientModel.getOne(ingredientId);
  if (!originIngredient) throw new ApplicationError(409);

  const recipes = await recipeModel.getPublishedByIngredient(ingredientId);
  if (recipes?.length) throw new ApplicationError(409);

  executeTransaction(async () => {
    const result = await ingredientModel.update(ingredientId, body);
    if (!result) throw new ApplicationError(400);

    const subCarbs = body.carbs - originIngredient.carbs,
      subPro = body.pro - originIngredient.pro,
      subFats = body.fats - originIngredient.fats,
      subKcal = body.kcal - originIngredient.kcal;

    await recipeModel.updateByIngredient(ingredientId, subCarbs, subPro, subFats, subKcal);
  });

  return { id: ingredientId };
};

export const isPublished = async (ingredientId: number, published: boolean, uid: number) => {
  const { creatorId } = (await ingredientModel.getOne(ingredientId)) ?? {};
  if (creatorId !== uid) throw new ApplicationError(409);
  await ingredientModel.isPublished([ingredientId], published);
};

export const remove = async (ingredientId: number, uid: number) => {
  const { creatorId } = (await ingredientModel.getOne(ingredientId)) ?? {};
  if (creatorId !== uid) throw new ApplicationError(409);

  const relations = await recipeIngredientRelationModel.getAllByIngredient(ingredientId);
  if (relations) throw new ApplicationError(409);
  await ingredientModel.remove(ingredientId);
};
