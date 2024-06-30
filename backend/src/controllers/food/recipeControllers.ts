import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { UserInfoRepository } from '../../repositories/user/userInfo.repository';
import { RecipeRepository } from '../../repositories/food/recipe.repository';

export class RecipeController {
  static async getRecipes(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await RecipeRepository.getAll(req.query, req.session.passport.user);
    return res.status(200).json({ data: data });
  }

  static async getRecipeDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await RecipeRepository.getOne(req.params.id, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async createRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await RecipeRepository.create(req.body, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await RecipeRepository.update(req.params.id, req.body, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    await RecipeRepository.delete(req.params.id, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
