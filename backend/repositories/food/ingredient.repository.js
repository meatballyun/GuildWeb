const ApplicationError = require('../../utils/error/applicationError.js');
const Ingredient = require('../../models/food/ingredient.model.js');
const Recipe = require('../../models/food/recipe.model.js');
const RecipeIngredientRelation = require('../../models/food/recipeIngredientRelation.model.js');

class IngredientRepository {
  static async getAll({ q, published }, uid) {
    const ingredients = published
      ? await Ingredient.getAllByName(q)
      : await Ingredient.getAllByUserAndName(uid, q);

    const hasIngredients = ingredients?.length;
    if (hasIngredients) {
      const data = ingredients.map(({ creator, description, ...ingredient }) => ({
        ...ingredient,
        isOwned: creator === uid,
      }));
      return data;
    }
    return;
  }

  static async getOne(IngredientId, uid) {
    const ingredient = await Ingredient.getOne(IngredientId);
    if (!ingredient) throw new ApplicationError(404);
    return {
      isOwned: ingredient.creator === uid,
      ...ingredient,
    };
  }

  static async create(body, uid) {
    const NewIngredientId = await Ingredient.create(uid, body);
    if (!NewIngredientId) throw new ApplicationError(400);
    return { id: NewIngredientId };
  }

  static async update(ingredientId, body, uid) {
    const { creator } = await Ingredient.getOne(ingredientId);
    if (creator !== uid) throw new ApplicationError(409);

    const forIngredientRelations = await RecipeIngredientRelation.getAllByIngredient(ingredientId);
    if (forIngredientRelations && !body.published) {
      for (const relation of forIngredientRelations) {
        const recipe = await Recipe.getOne(relation.recipes);
        if (recipe.published) throw new ApplicationError(409);
      }
    }

    const result = await Ingredient.update(ingredientId, body);
    if (!result) throw new ApplicationError(400);

    if (forIngredientRelations) {
      for (const relation of forIngredientRelations) {
        const forRecipeRelations = await RecipeIngredientRelation.getAllByRecipe(relation.recipes);
        let nutrition = { carbs: 0, pro: 0, fats: 0, kcal: 0 };
        for (const forRecipeRelation of forRecipeRelations) {
          const ingredientAmount = forRecipeRelation.amount;
          const ingredient = await Ingredient.getOne(forRecipeRelation.ingredients);
          nutrition[carbs] += ingredient.CARBS * ingredientAmount;
          nutrition[pro] += ingredient.PRO * ingredientAmount;
          nutrition[fats] += ingredient.FATS * ingredientAmount;
          nutrition[kcal] += ingredient.KCAL * ingredientAmount;
        }
        await Recipe.updateNutrition(relation.RECIPES, ...nutrition);
      }
    }
    return { id: ingredientId };
  }

  static async published(ingredientId, published, uid) {
    const { creator } = await Ingredient.getOne(ingredientId);
    if (creator !== uid) throw new ApplicationError(409);

    await Ingredient.published(ingredientId, published);
  }

  static async delete(ingredientId, uid) {
    const { creator } = await Ingredient.getOne(ingredientId);
    if (creator !== uid) throw new ApplicationError(409);

    const relations = await RecipeIngredientRelation.getAllByIngredient(ingredientId);
    if (relations) throw new ApplicationError(409);

    await Ingredient.delete(ingredientId);
  }
}

module.exports = IngredientRepository;
