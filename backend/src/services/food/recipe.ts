import { ApplicationError } from '../../utils/error/applicationError';
import { TypeSearch } from '../../types/TypeSearch';
import { BaseRecipe } from '../../types/food/Recipe';
import { ingredientModel, recipeModel, dietRecordModel, recipeIngredientRelationModel } from '../../models';
import * as ingredientService from './ingredient';

interface RecipeWithIngredients extends BaseRecipe {
  ingredients: { id: number; amount: number }[];
}

export const getAll = async ({ q, published }: TypeSearch, uid: number) => {
  const recipes = published ? await recipeModel.getAllByName(q) : await recipeModel.getAllByUserAndName(uid, q);

  if (recipes) {
    const data = recipes.map(({ creator, description, ...otherData }) => {
      return {
        ...otherData,
        isOwned: creator === uid,
      };
    });
    return data;
  }
  return;
};

export const getOne = async (recipeId: number, uid: number) => {
  const recipe = await recipeModel.getOne(recipeId);
  if (!recipe) throw new ApplicationError(404);

  const relations = await recipeIngredientRelationModel.getAllByRecipe(recipeId);

  let ingredients;
  if (relations?.length) {
    ingredients = await ingredientModel.getAllByRecipe(recipeId);
  }

  const data = {
    isOwned: recipe.creator === uid,
    ...recipe,
    ingredients: ingredients,
  };
  return data;
};

export const create = async ({ published, ingredients, ...data }: RecipeWithIngredients, uid: number) => {
  if (!ingredients) throw new ApplicationError(404);
  const newRecipeId = await recipeModel.create(data, uid);

  await Promise.all(
    ingredients.map(async ({ id, amount }) => {
      const ingredient = await ingredientModel.getOne(id);
      if (!ingredient) return;
      if (ingredient.creatorId === uid) return await recipeIngredientRelationModel.create(id, newRecipeId, amount);
      const copyIngredientId = await ingredientModel.copy(uid, ingredient, false);
      return await recipeIngredientRelationModel.create(copyIngredientId, newRecipeId, amount);
    })
  );

  if (published) {
    const relations = await recipeIngredientRelationModel.getAllByRecipe(newRecipeId);
    relations?.map(async ({ ingredients }) => await ingredientModel.isPublished(ingredients, true));
  }
  return { id: newRecipeId };
};

export const update = async (recipeId: number, { published, ingredients, ...data }: RecipeWithIngredients, uid: number) => {
  const recipe = await recipeModel.getOne(recipeId);
  if (!ingredients || !recipe) throw new ApplicationError(404);

  if (recipe.creator !== uid) throw new ApplicationError(409);
  const result = await recipeModel.update(recipeId, data);
  if (!result) throw new ApplicationError(400);

  await Promise.all(
    ingredients.map(async ({ id, amount }) => {
      const relation = await recipeIngredientRelationModel.getOne(id, recipeId);
      if (relation) {
        if (amount === -1) {
          await recipeIngredientRelationModel.deleteByIngredientAndRecipe(id, recipeId);
          return;
        }
        if (published) await ingredientModel.isPublished(id, true);
        await recipeIngredientRelationModel.update(id, recipeId, amount);
        return;
      }

      const ingredient = await ingredientModel.getOne(id);
      if (!ingredient) return;
      if (ingredient.creatorId === uid) return await recipeIngredientRelationModel.create(id, recipeId, amount);
      const copyIngredientId = await ingredientModel.copy(uid, ingredient, false);
      return await recipeIngredientRelationModel.create(copyIngredientId, recipeId, amount);
    })
  );

  return { id: recipeId };
};

export const remove = async (recipeId: number, uid: number) => {
  const { creatorId } = (await recipeModel.getOne(recipeId)) ?? {};
  if (creatorId !== uid) throw new ApplicationError(409);

  const dietRecord = await dietRecordModel.getAllByRecipe(uid, recipeId);
  if (dietRecord) throw new ApplicationError(409);

  await recipeModel.remove(recipeId);
  await recipeIngredientRelationModel.deleteByRecipe(recipeId);
};
