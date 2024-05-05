const ApplicationError = require('../../utils/error/applicationError.js');
const Ingredient = require('../../models/ingredientModel.js');
const Recipe = require('../../models/recipeModel.js');
const RecipeIngredientRelation = require('../../models/recipeIngredientRelationModel.js');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

class IngredientController {
  async getIngredients(req, res, next) {
    let ingredients, data;
    ingredients = req.query.q
      ? await Ingredient.getAllByUserAndName(req.session.passport.user, req.query.q)
      : await Ingredient.getAllByUser(req.session.passport.user);

    if (req.query.published) {
      const publicIngredients = req.query.q
        ? await Ingredient.getAllByNotUserAndName(req.session.passport.user, req.query.q)
        : await Ingredient.getAllByNotUser(req.session.passport.user);
      ingredients.push(...publicIngredients);
    }

    if (ingredients?.length) {
      data = ingredients.map((row) => ({
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
    }

    return res.status(200).json({ data });
  }

  async getIngredientDetail(req, res, next) {
    const [ingredient] = await Ingredient.getOne(req.params.id);
    const data = {
      isOwned: ingredient.CREATOR === req.session.passport.user,
      published: ingredient.PUBLISHED,
      name: ingredient.NAME,
      create_time: ingredient.CREATE_TIME,
      upload_time: ingredient.UPDATE_TIME,
      description: ingredient.DESCRIPTION,
      carbs: ingredient.CARBS,
      pro: ingredient.PRO,
      fats: ingredient.FATS,
      kcal: ingredient.KCAL,
      unit: ingredient.UNIT,
      imageUrl: ingredient.IMAGE_URL,
    };

    if (data) return res.status(200).json({ data });
    return next(new ApplicationError(404));
  }

  async createIngredient(req, res, next) {
    const newIngredient = await Ingredient.create(
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
    if (newIngredient['insertId']) {
      await updateUserExp(1, req.session.passport.user);
      return res.status(200).json({ data: { id: newIngredient['insertId'] } });
    }
  }

  async updateIngredient(req, res, next) {
    const relations = await RecipeIngredientRelation.getAllByIngredient(req.params.id);
    if (relations?.length && !req.body.published) {
      for (const relation of relations) {
        const [recipe] = await Recipe.getOne(relation.RECIPES);
        if (recipe.PUBLISHED) return next(new ApplicationError(409));
      }
    }

    const [ingredient] = await Ingredient.getOne(req.params.id);
    if (ingredient.CREATOR !== req.session.passport.user) return next(new ApplicationError(409));

    const query = await Ingredient.update(
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

    if (relations?.length) {
      for (const relation of relations) {
        const query = await RecipeIngredientRelation.getAllByRecipe(relation.RECIPES);
        let carbs = 0,
          pro = 0,
          fats = 0,
          kcal = 0;
        for (const q of query) {
          const [ingredient] = await Ingredient.getOne(q.INGREDIENTS);
          carbs += ingredient.CARBS * q.AMOUNT;
          pro += ingredient.PRO * q.AMOUNT;
          fats += ingredient.FATS * q.AMOUNT;
          kcal += ingredient.KCAL * q.AMOUNT;
        }
        await Recipe.updateNutrition(relation.RECIPES, carbs, pro, fats, kcal);
      }
    }

    if (query.affectedRows) return res.status(200).json({ data: { id: req.params.id } });
    return next(new ApplicationError(404));
  }

  async deleteIngredients(req, res, next) {
    const relations = await RecipeIngredientRelation.getAllByIngredient(req.params.id);
    console.log(relations);
    if (relations?.length) {
      return next(new ApplicationError(409));
    }

    const [ingredient] = await Ingredient.getOne(req.params.id);
    if (ingredient.CREATOR !== req.session.passport.user) return next(new ApplicationError(409));

    const query = await Ingredient.delete(req.params.id);
    if (query.changedRows) {
      return res.status(200).json({ data: 'OK' });
    } else {
      return next(new ApplicationError(404));
    }
  }
}

module.exports = IngredientController;
