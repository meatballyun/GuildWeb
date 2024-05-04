const Recipe = require('../../models/recipeModel.js');
const RecipeIngredientRelation = require('../../models/recipeIngredientRelationModel.js');
const Ingredient = require('../../models/ingredientModel.js');
const UserInfoController = require('../user/userinfoControllers.js');
const userInfoController = new UserInfoController();
const updateUserExp = userInfoController.updateUserExp;
const ApplicationError = require('../../utils/error/applicationError.js');

class RecipeController {
  async getRecipes(req, res, next) {
    try {
      let recipes, data;
      recipes = req.query.q
        ? await Recipe.getRecipesByCreatorAndName(req.session.passport.user, req.query.q)
        : await Recipe.getRecipesByCreator(req.session.passport.user);
      if (req.query.published) {
        const publicRecipes = req.query.q
          ? await Recipe.getRecipesByName(req.session.passport.user, req.query.q)
          : await Recipe.getRecipes(req.session.passport.user);
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

      return res.status(200).json({
        success: true,
        message: 'Data retrieval successful.',
        data: data,
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async getRecipeDetail(req, res, next) {
    try {
      const [recipe] = await Recipe.getRecipesById(req.params.id);
      if (!recipe) return next(new ApplicationError(404));

      const query = await RecipeIngredientRelation.getRecipeIngredientRelationByRecipe(
        req.params.id
      );
      const ingredients = await Promise.all(
        query.map(async (item) => {
          const [ingredient] = await Ingredient.getIngredientsById(item.INGREDIENTS);
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

      if (data) {
        return res.status(200).json({
          success: true,
          message: 'Data retrieval successful.',
          data: data,
        });
      }
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async addRecipe(req, res, next) {
    try {
      if (!req.body.ingredients) return next(new ApplicationError(404));
      const newRecipe = await Recipe.addRecipe(
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
          const [q] = await Ingredient.getIngredientsById(ingredient.id);
          if (q.CREATOR === req.session.passport.user)
            return await RecipeIngredientRelation.addRecipeIngredientRelation(
              ingredient.id,
              newRecipe['insertId'],
              ingredient.amount
            );
          const copyIngredient = await Ingredient.addIngredient(
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
          return await RecipeIngredientRelation.addRecipeIngredientRelation(
            copyIngredient['insertId'],
            newRecipe['insertId'],
            ingredient.amount
          );
        })
      );

      if (req.body.published) {
        const relations = await RecipeIngredientRelation.getRecipeIngredientRelationByRecipe(
          newRecipe['insertId']
        );
        relations.map(async (relation) => await Ingredient.publishIngredient(relation.INGREDIENTS));
      }

      await updateUserExp(1, req.session.passport.user);
      return res.status(200).json({
        success: true,
        message: 'Data uploaded successfully.',
        data: {
          id: newRecipe['insertId'],
        },
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async updateRecipe(req, res, next) {
    try {
      const [recipe] = await Recipe.getRecipesById(req.params.id);
      if (recipe.CREATOR === req.session.passport.user)
        return next(new ApplicationError(409, 'Your are not creator of this recipe.'));

      const query = await Recipe.updateRecipe(
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
          const getRelations =
            await RecipeIngredientRelation.getRecipeIngredientRelationByIngredientAndRecipe(
              ingredient.id,
              req.params.id
            );
          if (getRelations?.length)
            return await RecipeIngredientRelation.updateRecipeIngredientRelation(
              ingredient.id,
              req.params.id,
              ingredient.amount
            );
          const [q] = await Ingredient.getIngredientsById(ingredient.id);
          if (q.CREATOR === req.session.passport.user)
            return await RecipeIngredientRelation.addRecipeIngredientRelation(
              ingredient.id,
              req.params.id,
              ingredient.amount
            );
          const copyIngredient = await Ingredient.addIngredient(
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
          return await RecipeIngredientRelation.addRecipeIngredientRelation(
            copyIngredient['insertId'],
            req.params.id,
            ingredient.amount
          );
        })
      );

      if (req.body.published) {
        const relations = await RecipeIngredientRelation.getRecipeIngredientRelationByRecipe(
          req.params.id
        );
        relations.map(async (relation) => {
          await Ingredient.publishIngredient(relation.INGREDIENTS);
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Data updated successfully.',
        data: {
          id: req.params.id,
        },
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async deleteRecipe(req, res, next) {
    try {
      const [recipe] = await Recipe.getRecipesById(req.params.id);
      if (recipe.CREATOR === req.session.passport.user)
        return next(new ApplicationError(409, 'Your are not creator of this recipe.'));

      const query = await Recipe.deleteRecipesById(req.params.id);
      if (query.changedRows) {
        await RecipeIngredientRelation.deleteRecipeIngredientRelationByRecipe(req.params.id);
        return res.status(200).json({
          success: true,
          message: 'The data with the specified object ID has been successfully deleted.',
          data: 'OK',
        });
      }
      return next(new ApplicationError(404));
    } catch (error) {
      return next(new ApplicationError(400, err));
    }
  }
}

module.exports = RecipeController;
