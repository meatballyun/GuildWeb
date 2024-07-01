import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { UserInfoService } from '../../services/user/userInfo';
import { RecipeService } from '../../services/food/recipe';

export class RecipeController {
  static async getRecipes(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await RecipeService.getAll(req.query, req.session.passport.user);
    return res.status(200).json({ data: data });
  }

  static async getRecipeDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await RecipeService.getOne(req.params.id, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async createRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await RecipeService.create(req.body, req.session.passport.user);
    await UserInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await RecipeService.update(req.params.id, req.body, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    await RecipeService.delete(req.params.id, req.session.passport.user);
    await UserInfoService.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
