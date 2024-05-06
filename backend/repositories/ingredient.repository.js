const ApplicationError = require('../utils/error/applicationError.js');
const convertToCamelCase = require('../utils/convertToCamelCase.js');
const Ingredient = require('../models/ingredient.model.js');
const Recipe = require('../models/recipe.model.js');
const RecipeIngredientRelation = require('../models/recipeIngredientRelation.model.js');

class IngredientRepository {
  async getAll(uid, query) {
    let ingredients, data;
    ingredients = await Ingredient.getAllByUserAndName(uid, query.q);
    const isPublished = query.published === 'true';
    if (isPublished) {
      const publicIngredients = await Ingredient.getAllByNotUserAndName(uid, query.q);
      ingredients.push(...publicIngredients);
    }
    const hasIngredients = ingredients?.length;
    if (hasIngredients) {
      data = ingredients.map((row) => ({
        id: row.ID,
        isOwned: row.CREATOR === uid,
        published: row.PUBLISHED,
        name: row.NAME,
        carbs: row.CARBS,
        pro: row.PRO,
        fats: row.FATS,
        kcal: row.KCAL,
        unit: row.UNIT,
        imageUrl: row.IMAGE_URL,
      }));
    }

    return data;
  }

  async getOne(uid, id) {
    const ingredients = await Ingredient.getOne(id);
    const ingredient = ingredients?.[0];
    if (!ingredient) throw new ApplicationError(404);
    const convertIngredient = convertToCamelCase(ingredient);
    const data = {
      isOwned: ingredient.CREATOR === uid,
      ...convertIngredient,
    };

    if (data) return data;
  }

  async create(uid, body) {
    const result = await Ingredient.create(uid, body);
    if (!result['insertId']) throw new ApplicationError(400);
    return { id: result['insertId'] };
  }

  async update(uid, body, id) {
    const relations = await RecipeIngredientRelation.getAllByIngredient(id);
    const hasRelations = relations?.length;
    if (hasRelations && !body.published) {
      for (const relation of relations) {
        const [recipe] = await Recipe.getOne(relation.RECIPES);
        if (recipe.PUBLISHED) throw new ApplicationError(409);
      }
    }

    const [ingredient] = await Ingredient.getOne(id);
    if (ingredient.CREATOR !== uid) throw new ApplicationError(409);
    const result = await Ingredient.update(id, body);
    if (!result.affectedRows) throw new ApplicationError(400);

    if (hasRelations) {
      for (const relation of relations) {
        const getRelated = await RecipeIngredientRelation.getAllByRecipe(relation.RECIPES);
        let carbs = 0,
          pro = 0,
          fats = 0,
          kcal = 0;
        for (const related of getRelated) {
          const [ingredient] = await Ingredient.getOne(related.INGREDIENTS);
          carbs += ingredient.CARBS * related.AMOUNT;
          pro += ingredient.PRO * related.AMOUNT;
          fats += ingredient.FATS * related.AMOUNT;
          kcal += ingredient.KCAL * related.AMOUNT;
        }
        await Recipe.updateNutrition(relation.RECIPES, carbs, pro, fats, kcal);
      }
    }
    return { id: id };
  }

  async published(uid, published, id) {
    const [ingredient] = await Ingredient.getOne(id);
    if (ingredient.CREATOR !== uid) throw new ApplicationError(409);
    await Ingredient.published(id, published);
    return true;
  }

  async delete(uid, id) {
    const relations = await RecipeIngredientRelation.getAllByIngredient(id);
    const hasRelations = relations?.length;
    if (hasRelations) throw new ApplicationError(409);

    const [ingredient] = await Ingredient.getOne(id);
    if (ingredient.CREATOR !== uid) throw new ApplicationError(409);

    const result = await Ingredient.delete(id);
    if (result.changedRows) return 'OK';
    throw new ApplicationError(409);
  }
}

module.exports = IngredientRepository;
