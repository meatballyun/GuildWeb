import { ApplicationError } from '../../utils/error/applicationError';
import { BaseIngredient } from '../../types/food/Ingredient';
import { TypeSearch } from '../../types/TypeSearch';
import { IngredientModel, RecipeModel, RecipeIngredientRelationModel } from '../../models';

export const getAll = async ({ q, published }: TypeSearch, uid: number) => {
  const ingredients = published ? await ingredientModel.getAllByName(q) : await ingredientModel.getAllByUserAndName(uid, q);
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
    isOwned: ingredient.creator === uid,
    ...ingredient,
  };
};

export const create = async (body: BaseIngredient, uid: number) => {
  const NewIngredientId = await ingredientModel.create(body, uid);
  if (!NewIngredientId) throw new ApplicationError(400);
  return { id: NewIngredientId };
};

export const update = async (ingredientId: number, body: BaseIngredient, uid: number) => {
  const { creatorId } = (await IngredientModel.getOne(ingredientId)) ?? {};
  if (creatorId !== uid) throw new ApplicationError(409);

  const forIngredientRelations = await RecipeIngredientRelationModel.getAllByIngredient(ingredientId);
  if (forIngredientRelations && !body.published) {
    for (const relation of forIngredientRelations) {
      const recipe = await RecipeModel.getOne(relation.recipes);
      if (recipe?.published) throw new ApplicationError(409);
    }
  }

  const result = await IngredientModel.update(ingredientId, body);
  if (!result) throw new ApplicationError(400);

  type Nutrition = {
    carbs: number;
    pro: number;
    fats: number;
    kcal: number;
  };

  if (forIngredientRelations) {
    forIngredientRelations.map(async (relation) => {
      const forRecipeRelations = await RecipeIngredientRelationModel.getAllByRecipe(relation.recipes);
      let nutrition: Nutrition = { carbs: 0, pro: 0, fats: 0, kcal: 0 };
      forRecipeRelations?.map(async (forRecipeRelation) => {
        const ingredientAmount = forRecipeRelation.amount;
        const ingredient = await IngredientModel.getOne(forRecipeRelation.ingredients);
        if (!ingredient) return;
        nutrition.carbs += ingredient?.carbs * ingredientAmount;
        nutrition.pro += ingredient?.pro * ingredientAmount;
        nutrition.fats += ingredient?.fats * ingredientAmount;
        nutrition.kcal += ingredient?.kcal * ingredientAmount;
      });
      await RecipeModel.updateNutrition(relation.RECIPES, nutrition.carbs, nutrition.pro, nutrition.fats, nutrition.kcal);
    });
  }
  return { id: ingredientId };
};

export const isPublished = async (ingredientId: number, published: boolean, uid: number) => {
  const { creatorId } = (await ingredientModel.getOne(ingredientId)) ?? {};
  if (creatorId !== uid) throw new ApplicationError(409);
  await ingredientModel.isPublished(ingredientId, published);
};

export const remove = async (ingredientId: number, uid: number) => {
  const { creatorId } = (await ingredientModel.getOne(ingredientId)) ?? {};
  if (creatorId !== uid) throw new ApplicationError(409);
  const relations = await recipeIngredientRelationModel.getAllByIngredient(ingredientId);
  if (relations) throw new ApplicationError(409);
  await ingredientModel.remove(ingredientId);
};
