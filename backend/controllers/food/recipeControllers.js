const ApplicationError = require('../../utils/error/applicationError.js');
const DietRecord = require('../../models/dietRecordModel.js');
const Ingredient = require('../../models/ingredientModel.js');
const Recipe = require('../../models/recipeModel.js');
const RecipeIngredientRelation = require('../../models/recipeIngredientRelationModel.js');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

class RecipeController {
  async getRecipes(req, res, next) {
    let recipes, data;
    recipes = req.query.q
      ? await Recipe.getAllByUserAndName(req.session.passport.user, req.query.q)
      : await Recipe.getAllByUser(req.session.passport.user);
    if (req.query.published) {
      const publicRecipes = req.query.q
        ? await Recipe.getAllByNotUserAndName(req.session.passport.user, req.query.q)
        : await Recipe.getAllByNotUser(req.session.passport.user);
      recipes.push(...publicRecipes);
    }
    data = recipes.map((row) => ({
      id: row.ID,
      isOwned: row.CREATOR === req.session.passport.user,
      published: row.PUBLISHED,
      name: row.NAME,
      carbs: row.CARBS,
      pro: row.PRO,
      fats: row.FATS,
      kcal: row.KCAL,
      unit: row.UNIT,
      imageUrl: row.IMAGE_URL,
    }));
    return res.status(200).json({ data });
  }

  async getRecipeDetail(req, res, next) {
    const [recipe] = await Recipe.getOne(req.params.id);
    if (!recipe) return next(new ApplicationError(404));

    const query = await RecipeIngredientRelation.getAllByRecipe(req.params.id);
    const ingredients = await Promise.all(
      query.map(async (item) => {
        const [ingredient] = await Ingredient.getOne(item.INGREDIENTS);
        return {
          id: ingredient.ID,
          isOwned: ingredient.CREATOR === req.session.passport.user,
          published: ingredient.PUBLISHED,
          name: ingredient.NAME,
          carbs: ingredient.CARBS,
          pro: ingredient.PRO,
          fats: ingredient.FATS,
          kcal: ingredient.KCAL,
          unit: ingredient.UNIT,
          imageUrl: ingredient.IMAGE_URL,
          amount: item.AMOUNT,
        };
      })
    );

    const data = {
      isOwned: recipe.CREATOR === req.session.passport.user,
      published: recipe.PUBLISHED,
      name: recipe.NAME,
      description: recipe.DESCRIPTION,
      unit: recipe.UNIT,
      imageUrl: recipe.IMAGE_URL,
      ingredients: ingredients,
    };
    return res.status(200).json({ data });
  }

  async createRecipe(req, res, next) {
    if (!req.body.ingredients) return next(new ApplicationError(404));
    const newRecipe = await Recipe.create(
      req.session.passport.user,
      req.body.name,
      req.body.description,
      req.body.carbs,
      req.body.pro,
      req.body.fats,
      req.body.kcal,
      req.body.unit,
      req.body.imageUrl,
      req.body.published
    );

    await Promise.all(
      req.body.ingredients.map(async (ingredient) => {
        const [q] = await Ingredient.getOne(ingredient.id);
        if (q.CREATOR === req.session.passport.user)
          return await RecipeIngredientRelation.create(
            ingredient.id,
            newRecipe['insertId'],
            ingredient.amount
          );
        const copyIngredient = await Ingredient.create(
          req.session.passport.user,
          q.NAME,
          q.DESCRIPTION,
          q.CARBS,
          q.PRO,
          q.FATS,
          q.KCAL,
          q.UNIT,
          q.IMAGE_URL,
          false
        );
        return await RecipeIngredientRelation.create(
          copyIngredient['insertId'],
          newRecipe['insertId'],
          ingredient.amount
        );
      })
    );

    if (req.body.published) {
      const relations = await RecipeIngredientRelation.getAllByRecipe(newRecipe['insertId']);
      relations.map(async (relation) => await Ingredient.publishTorF(relation.INGREDIENTS, 1));
    }
    updateUserExp(1, req.session.passport.user);

    return res.status(200).json({ data: { id: newRecipe['insertId'] } });
  }

  async updateRecipe(req, res, next) {
    const [recipe] = await Recipe.getOne(req.params.id);
    if (recipe.CREATOR !== req.session.passport.user) return next(new ApplicationError(409));
    const query = await Recipe.update(
      req.params.id,
      req.body.name,
      req.body.description,
      req.body.carbs,
      req.body.pro,
      req.body.fats,
      req.body.kcal,
      req.body.unit,
      req.body.imageUrl,
      req.body.published
    );
    if (!query.affectedRows) return next(new ApplicationError(404));

    await Promise.all(
      req.body.ingredients.map(async (ingredient) => {
        const getRelations = await RecipeIngredientRelation.getOne(ingredient.id, req.params.id);
        if (getRelations?.length) {
          if (ingredient.amount === -1) {
            await RecipeIngredientRelation.deleteByIngredientAndRecipe(
              ingredient.id,
              req.params.id
            );
            return;
          }
          if (req.body.published) await Ingredient.publishTorF(ingredient.id, req.body.published);
          return await RecipeIngredientRelation.update(
            ingredient.ID,
            req.params.id,
            ingredient.amount
          );
        }

        const [q] = await Ingredient.getOne(ingredient.id);
        if (q.CREATOR === req.session.passport.user)
          return await RecipeIngredientRelation.create(
            ingredient.id,
            req.params.id,
            ingredient.amount
          );
        const copyIngredient = await Ingredient.create(
          req.session.passport.user,
          q.NAME,
          q.DESCRIPTION,
          q.CARBS,
          q.PRO,
          q.FATS,
          q.KCAL,
          q.UNIT,
          q.IMAGE_URL,
          req.body.published
        );
        return await RecipeIngredientRelation.create(
          copyIngredient['insertId'],
          req.params.id,
          ingredient.amount
        );
      })
    );

    return res.status(200).json({ data: { id: req.params.id } });
  }

  async deleteRecipe(req, res, next) {
    const [recipe] = await Recipe.getOne(req.params.id);
    if (recipe.CREATOR !== req.session.passport.user) return next(new ApplicationError(409));
    const query = await DietRecord.getAllByRecipe(req.session.passport.user, req.params.id);
    if (query?.length) return next(new ApplicationError(409));

    await Recipe.delete(req.params.id);
    await RecipeIngredientRelation.deleteByRecipe(req.params.id);
    return res.status(200).json({ data: 'OK' });
  }
}

module.exports = RecipeController;
