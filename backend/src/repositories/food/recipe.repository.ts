import { ApplicationError } from '../../utils/error/applicationError';
import { BaseRecipe } from '../../custom/food/Recipe';
import { DietRecordModel } from '../../models/food/dietRecord.model';
import { IngredientModel } from '../../models/food/ingredient.model';
import { RecipeModel } from '../../models/food/recipe.model';
import { RecipeIngredientRelationModel } from '../../models/food/recipeIngredientRelation.model';
import IngredientRepository from './ingredient.repository';

type TypeSearch = {
  q: string;
  published: boolean;
};

type RecipeIngredient = {
  id: number;
  amount: number;
};

interface RecipeWithIngredients extends BaseRecipe {
  ingredients: RecipeIngredient[];
}

class RecipeRepository {
  static async getAll({ q, published }: TypeSearch, uid: number) {
    const recipes = published ? await RecipeModel.getAllByName(q) : await RecipeModel.getAllByUserAndName(uid, q);

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
  }

  static async getOne(recipeId: number, uid: number) {
    const recipe = await RecipeModel.getOne(recipeId);
    if (!recipe) throw new ApplicationError(404);

    const relations = await RecipeIngredientRelationModel.getAllByRecipe(recipeId);
    const ingredients = await Promise.all(
      relations.map(async ({ ingredients, amount }) => {
        const ingredient = await IngredientRepository.getOne(ingredients, uid);
        const { createTime, updateTime, description, ...otherData } = ingredient;
        return {
          ...otherData,
          amount,
        };
      })
    );
    const data = {
      isOwned: recipe.creator === uid,
      ...recipe,
      ingredients: ingredients,
    };
    return data;
  }

  static async create({ published, ingredients, ...data }: RecipeWithIngredients, uid: number) {
    if (!ingredients) throw new ApplicationError(404);
    const newRecipeId = await RecipeModel.create(data, uid);

    await Promise.all(
      ingredients.map(async ({ id, amount }) => {
        const ingredient = await IngredientModel.getOne(id);
        if (!ingredient) return;
        if (ingredient.creatorId === uid) return await RecipeIngredientRelationModel.create(id, newRecipeId, amount);
        const copyIngredientId = await IngredientModel.copy(uid, ingredient, false);
        return await RecipeIngredientRelationModel.create(copyIngredientId, newRecipeId, amount);
      })
    );

    if (published) {
      const relations = await RecipeIngredientRelationModel.getAllByRecipe(newRecipeId);
      relations.map(async ({ ingredients }) => await IngredientModel.isPublished(ingredients, true));
    }
    return { id: newRecipeId };
  }

  static async update(recipeId: number, { published, ingredients, ...data }: RecipeWithIngredients, uid: number) {
    const recipe = await RecipeModel.getOne(recipeId);
    if (!ingredients || !recipe) throw new ApplicationError(404);

    if (recipe.creator !== uid) throw new ApplicationError(409);
    const result = await RecipeModel.update(recipeId, data);
    if (!result) throw new ApplicationError(400);

    await Promise.all(
      ingredients.map(async ({ id, amount }) => {
        const relation = await RecipeIngredientRelationModel.getOne(id, recipeId);
        if (relation) {
          if (amount === -1) {
            await RecipeIngredientRelationModel.deleteByIngredientAndRecipe(id, recipeId);
            return;
          }
          if (published) await IngredientModel.isPublished(id, true);
          await RecipeIngredientRelationModel.update(id, recipeId, amount);
          return;
        }

        const ingredient = await IngredientModel.getOne(id);
        if (!ingredient) return;
        if (ingredient.creatorId === uid) return await RecipeIngredientRelationModel.create(id, recipeId, amount);
        const copyIngredientId = await IngredientModel.copy(uid, ingredient, false);
        return await RecipeIngredientRelationModel.create(copyIngredientId, recipeId, amount);
      })
    );

    return { id: recipeId };
  }

  static async delete(recipeId: number, uid: number) {
    const { creatorId } = (await RecipeModel.getOne(recipeId)) ?? {};
    if (creatorId !== uid) throw new ApplicationError(409);

    const dietRecord = await DietRecordModel.getAllByRecipe(uid, recipeId);
    if (dietRecord) throw new ApplicationError(409);

    await RecipeModel.delete(recipeId);
    await RecipeIngredientRelationModel.deleteByRecipe(recipeId);
  }
}

export default RecipeRepository;
