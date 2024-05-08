const ApplicationError = require('../../utils/error/applicationError.js');
const DietRecord = require('../../models/food/dietRecord.model.js');
const Ingredient = require('../../models/food/ingredient.model.js');
const Recipe = require('../../models/food/recipe.model.js');
const RecipeIngredientRelation = require('../../models/food/recipeIngredientRelation.model.js');
const IngredientRepository = require('./ingredient.repository.js');

class RecipeRepository {
  static async getAll({ q, published }, uid) {
    const recipes = published
      ? await Recipe.getAllByName(q)
      : await Recipe.getAllByUserAndName(uid, q);

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

  static async getOne(recipeId, uid) {
    const recipe = await Recipe.getOne(recipeId);
    if (!recipe) throw new ApplicationError(404);

    const relations = await RecipeIngredientRelation.getAllByRecipe(recipeId);
    const ingredients = await Promise.all(
      relations.map(async ({ ingredients, amount }) => {
        const ingredient = await IngredientRepository.getOne(ingredients, uid);
        const { create_time, upload_time, description, ...otherData } = ingredient;
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

  static async create({ published, ingredients, ...data }, uid) {
    if (!ingredients) throw new ApplicationError(404);
    const newRecipeId = await Recipe.create(uid, data);

    await Promise.all(
      ingredients.map(async ({ id, amount }) => {
        const { creator, ...ingredientData } = await Ingredient.getOne(id);
        if (creator === uid) return await RecipeIngredientRelation.create(id, newRecipeId, amount);
        const copyIngredientId = await Ingredient.copy(uid, ingredientData, false);
        return await RecipeIngredientRelation.create(copyIngredientId, newRecipeId, amount);
      })
    );

    if (published) {
      const relations = await RecipeIngredientRelation.getAllByRecipe(newRecipeId);
      relations.map(async ({ ingredients }) => await Ingredient.published(ingredients, true));
    }
    return { id: newRecipeId };
  }

  static async update(recipeId, { published, ingredients, ...data }, uid) {
    const recipe = await Recipe.getOne(recipeId);
    if (!ingredients || !recipe) throw new ApplicationError(404);

    if (recipe.creator !== uid) throw new ApplicationError(409);
    const result = await Recipe.update(recipeId, data);
    if (!result) throw new ApplicationError(400);

    await Promise.all(
      ingredients.map(async ({ id, amount }) => {
        const relation = await RecipeIngredientRelation.getOne(id, recipeId);
        if (relation) {
          if (amount === -1) {
            await RecipeIngredientRelation.deleteByIngredientAndRecipe(id, recipeId);
            return;
          }
          if (published) await Ingredient.published(id, true);
          await RecipeIngredientRelation.update(id, recipeId, amount);
          return;
        }

        const { creator, ...ingredientData } = await Ingredient.getOne(id);
        if (creator === uid) return await RecipeIngredientRelation.create(id, recipeId, amount);
        const copyIngredientId = await Ingredient.copy(uid, ingredientData, false);
        return await RecipeIngredientRelation.create(copyIngredientId, recipeId, amount);
      })
    );

    return { id: recipeId };
  }

  static async delete(recipeId, uid) {
    const { creator } = await Recipe.getOne(recipeId);
    if (creator !== uid) throw new ApplicationError(409);

    const dietRecord = await DietRecord.getAllByRecipe(uid, recipeId);
    if (dietRecord) throw new ApplicationError(409);

    await Recipe.delete(recipeId);
    await RecipeIngredientRelation.deleteByRecipe(recipeId);
  }
}

module.exports = RecipeRepository;
