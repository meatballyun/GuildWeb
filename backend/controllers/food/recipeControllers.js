const RecipeRepository = new (require('../../repositories/recipe.repository'))();
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;
class RecipeController {
  async getRecipes(req, res, next) {
    const data = await RecipeRepository.getAll(req.session.passport.user, req.query);
    return res.status(200).json({ data });
  }

  async getRecipeDetail(req, res, next) {
    const data = await RecipeRepository.getOne(req.session.passport.user, req.params.id);
    return res.status(200).json({ data });
  }

  async createRecipe(req, res, next) {
    const data = await RecipeRepository.create(req.session.passport.user, req.body);
    updateUserExp(1, req.session.passport.use);
    return res.status(200).json({ data });
  }

  async updateRecipe(req, res, next) {
    const data = await RecipeRepository.update(req.session.passport.user, req.body, req.params.id);
    return res.status(200).json({ data });
  }

  async deleteRecipe(req, res, next) {
    const result = await RecipeRepository.delete(req.session.passport.user, req.params.id);
    updateUserExp(-1, req.session.passport.user);
    return res.status(200).json({ data: result });
  }
}

module.exports = RecipeController;
