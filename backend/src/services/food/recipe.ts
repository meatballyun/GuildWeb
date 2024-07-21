import _ from 'lodash';
import { ApplicationError } from '../../utils/error/applicationError';
import { TypeSearch } from '../../types/TypeSearch';
import { BaseRecipe } from '../../types/food/Recipe';
import { ingredientModel, recipeModel, dietRecordModel, recipeIngredientRelationModel } from '../../models';
import { executeTransaction } from '../../utils/executeTransaction';
import { BaseRecipeIngredientRelation } from '../../types/food/RecipeIngredientRelation';

interface RecipeWithIngredients extends BaseRecipe {
  ingredients: { id: number; amount: number; creatorId: number }[];
}

export const getAll = async ({ q, published }: TypeSearch, uid: number) => {
  const recipes = published === 'true' ? await recipeModel.getAllByName(q) : await recipeModel.getAllByUserAndName(uid, q);
  const hasRecipes = recipes?.length;
  if (hasRecipes) {
    const data = recipes.map(({ creatorId, description, ...otherData }) => {
      return {
        ...otherData,
        creatorId,
        isOwned: creatorId === uid,
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
    isOwned: recipe.creatorId === uid,
    ...recipe,
    ingredients: ingredients,
  };
  return data;
};

export const create = async ({ published, ingredients, ...data }: RecipeWithIngredients, uid: number) => {
  if (!ingredients) throw new ApplicationError(400);

  return executeTransaction(async () => {
    const newRecipeId = await recipeModel.create(data, uid);

    const ownedIngredients: BaseRecipeIngredientRelation[] = [];
    const otherIngredientIds: number[] = [];
    const otherIngredientAmounts: number[] = [];

    ingredients.map(({ id, amount, creatorId }) => {
      if (creatorId === uid) {
        ownedIngredients.push({ ingredientId: id, recipeId: newRecipeId, amount });
      } else {
        otherIngredientIds.push(id);
        otherIngredientAmounts.push(amount);
      }
    });

    if (otherIngredientIds?.length) {
      let firstInsertId = await ingredientModel.copyMany(uid, otherIngredientIds);

      otherIngredientAmounts.map((amount, index) => {
        const newIngredientId = firstInsertId + index;
        ownedIngredients.push({ ingredientId: newIngredientId, recipeId: newRecipeId, amount });
      });
    }
    if (ownedIngredients?.length) await recipeIngredientRelationModel.createMany(ownedIngredients);

    if (published) {
      const relations = await recipeIngredientRelationModel.getAllByRecipe(newRecipeId);
      if (relations?.length) {
        await ingredientModel.isPublished(
          relations.map(({ ingredientId }) => ingredientId),
          true
        );
      }
    }

    return newRecipeId;
  });
};

export const update = async (recipeId: number, { ingredients, ...data }: RecipeWithIngredients, uid: number) => {
  if (!ingredients) throw new ApplicationError(400);
  const recipe = await recipeModel.getOne(recipeId);
  if (recipe?.creatorId !== uid) throw new ApplicationError(409);

  executeTransaction(async () => {
    const result = await recipeModel.update(recipeId, data);
    if (!result) throw new ApplicationError(400);

    const newIngredients: BaseRecipeIngredientRelation[] = [];
    const otherIngredientIds: number[] = [];
    const otherIngredientAmounts: number[] = [];
    const ownedIngredients = ingredients
      .map(({ id, amount, creatorId }) => {
        if (creatorId !== uid) {
          otherIngredientIds.push(id);
          otherIngredientAmounts.push(amount);
        } else {
          return { ingredientId: id, amount };
        }
      })
      .filter((item) => item);
    const originRelations = (await recipeIngredientRelationModel.getAllByRecipe(recipeId)) || [];
    const originIngredientIds = originRelations?.map(({ ingredientId }) => ingredientId);
    const removeIngredientIds = _.difference(
      originIngredientIds,
      ingredients.map((ingredient) => ingredient.id)
    );
    const updateIngredients = _.intersectionBy(ownedIngredients, originRelations, 'ingredientId');
    const diffIngredients = _.differenceBy(ownedIngredients, originRelations, 'ingredientId');
    if (diffIngredients?.length) {
      diffIngredients.map((value) => {
        if (!value) return;
        const { ingredientId, amount } = value;
        newIngredients.push({ ingredientId, recipeId, amount });
      });
    }

    if (removeIngredientIds?.length) await recipeIngredientRelationModel.deleteManyByIngredientAndRecipe(recipeId, removeIngredientIds);
    if (updateIngredients?.length)
      await recipeIngredientRelationModel.updateMany(recipeId, updateIngredients.filter((ingredient) => ingredient !== undefined) as { ingredientId: number; amount: number }[]);

    if (otherIngredientIds?.length) {
      let firstInsertId = await ingredientModel.copyMany(uid, otherIngredientIds);
      otherIngredientAmounts.map((amount, index) => {
        const newIngredientId = firstInsertId + index;
        newIngredients.push({ ingredientId: newIngredientId, recipeId, amount });
      });
    }

    if (newIngredients?.length) await recipeIngredientRelationModel.createMany(newIngredients);

    if (data.published) {
      const relations = await recipeIngredientRelationModel.getAllByRecipe(recipeId);
      if (relations?.length) {
        await ingredientModel.isPublished(
          relations.map(({ ingredientId }) => ingredientId),
          true
        );
      }
    }
  });

  return { id: recipeId };
};

export const remove = async (recipeId: number, uid: number) => {
  const { creatorId } = (await recipeModel.getOne(recipeId)) ?? {};
  if (creatorId !== uid) throw new ApplicationError(409);

  const dietRecord = await dietRecordModel.getAllByRecipe(uid, recipeId);
  if (dietRecord?.length) throw new ApplicationError(409);
  executeTransaction(async () => {
    await recipeModel.remove(recipeId);
    await recipeIngredientRelationModel.deleteByRecipe(recipeId);
  });
};
