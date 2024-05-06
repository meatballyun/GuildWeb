const ApplicationError = require('../utils/error/applicationError.js');
const convertToCamelCase = require('../utils/convertToCamelCase.js');
const DietRecord = require('../models/dietRecord.model.js');
const Ingredient = require('../models/ingredient.model.js');
const Recipe = require('../models/recipe.model.js');
const RecipeIngredientRelation = require('../models/recipeIngredientRelation.model.js');
const IngredientRepository = new (require('./ingredient.repository'))();

class RecipeRepository {
  async getAll(uid, query) {
    let recipes, data;
    recipes = await Recipe.getAllByUserAndName(uid, query.q);
    if (query.published) {
      const publicRecipes = await Recipe.getAllByNotUserAndName(uid, query.q);
      recipes.push(...publicRecipes);
    }
    data = recipes.map((row) => {
      const convertRecipe = convertToCamelCase(row);
      return {
        isOwned: row.CREATOR === uid,
        ...convertRecipe,
      };
    });

    return data;
  }

  async getOne(uid, id) {
    const [recipe] = await Recipe.getOne(id);
    if (!recipe) throw new ApplicationError(404);

    const relations = await RecipeIngredientRelation.getAllByRecipe(id);
    const ingredients = await Promise.all(
      relations.map(async (relation) => {
        const ingredient = await IngredientRepository.getOne(uid, relation.INGREDIENTS);
        const { create_time, upload_time, description, ...filteredIngredient } = ingredient;
        return {
          ...filteredIngredient,
          amount: relation.AMOUNT,
        };
      })
    );
    const convertRecipe = convertToCamelCase(recipe);
    const data = {
      isOwned: recipe.CREATOR === uid,
      ...convertRecipe,
      ingredients: ingredients,
    };
    return data;
  }

  async create(uid, body) {
    if (!body.ingredients) throw new ApplicationError(404);
    const newRecipe = await Recipe.create(uid, body);

    await Promise.all(
      body.ingredients.map(async (ingredient) => {
        const [getIngredient] = await Ingredient.getOne(ingredient.id);
        if (getIngredient.CREATOR === uid)
          return await RecipeIngredientRelation.create(
            ingredient.id,
            newRecipe['insertId'],
            ingredient.amount
          );
        const copyIngredient = await Ingredient.copy(uid, getIngredient, false);
        return await RecipeIngredientRelation.create(
          copyIngredient['insertId'],
          newRecipe['insertId'],
          ingredient.amount
        );
      })
    );

    if (body.published) {
      const relations = await RecipeIngredientRelation.getAllByRecipe(newRecipe['insertId']);
      relations.map(async (relation) => await Ingredient.published(relation.INGREDIENTS, true));
    }
    return { id: newRecipe['insertId'] };
  }

  async update(uid, body, id) {
    if (!body.ingredients) throw new ApplicationError(404);
    const [recipe] = await Recipe.getOne(id);
    if (recipe.CREATOR !== uid) throw new ApplicationError(409);
    const result = await Recipe.update(id, body);
    if (!result.affectedRows) throw new ApplicationError(404);

    await Promise.all(
      body.ingredients.map(async (ingredient) => {
        console.log(ingredient.id);
        const relation = await RecipeIngredientRelation.getOne(ingredient.id, id);
        const hasRelation = relation?.length;
        if (hasRelation) {
          if (ingredient.amount === -1) {
            await RecipeIngredientRelation.deleteByIngredientAndRecipe(ingredient.id, id);
            return;
          }
          if (body.published) await Ingredient.published(ingredient.id, true);
          await RecipeIngredientRelation.update(ingredient.id, id, ingredient.amount);
          return;
        }

        const [getIngredient] = await Ingredient.getOne(ingredient.id);
        if (getIngredient.CREATOR === uid)
          return await RecipeIngredientRelation.create(ingredient.id, id, ingredient.amount);
        const copyIngredient = await Ingredient.copy(uid, getIngredient, false);

        return await RecipeIngredientRelation.create(
          copyIngredient['insertId'],
          id,
          ingredient.amount
        );
      })
    );

    return id;
  }

  async delete(uid, id) {
    const [recipe] = await Recipe.getOne(id);
    if (recipe.CREATOR !== uid) throw new ApplicationError(409);
    const dietRecord = await DietRecord.getAllByRecipe(uid, id);
    const hasDietRecord = dietRecord?.length;
    if (hasDietRecord) throw new ApplicationError(409);

    await Recipe.delete(id);
    await RecipeIngredientRelation.deleteByRecipe(id);
    return 'OK';
  }
}

module.exports = RecipeRepository;
