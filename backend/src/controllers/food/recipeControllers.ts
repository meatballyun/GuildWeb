// @ts-nocheck
import UserInfoRepository from '../../repositories/user/userInfo.repository';
import RecipeRepository from '../../repositories/food/recipe.repository';

export class RecipeController {
  static async getRecipes(req, res, next) {
    const data = await RecipeRepository.getAll(req.query, req.session.passport.user);
    return res.status(200).json({ data: data });
  }

  static async getRecipeDetail(req, res, next) {
    const data = await RecipeRepository.getOne(req.params.id, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async createRecipe(req, res, next) {
    const data = await RecipeRepository.create(req.body, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateRecipe(req, res, next) {
    const data = await RecipeRepository.update(req.params.id, req.body, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteRecipe(req, res, next) {
    await RecipeRepository.delete(req.params.id, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
