import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { userInfoService } from '../../services/user';
import { recipeService } from '../../services/food';

export class RecipeController {
  static async getRecipes(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await recipeService.getAll(req.query, req.session.passport.user);
    return res.status(200).json({ data: data });
  }

  static async getRecipeDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await recipeService.getOne(req.params.id, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async createRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await recipeService.create(req.body, req.session.passport.user);
    await userInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await recipeService.update(req.params.id, req.body, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    await recipeService.remove(req.params.id, req.session.passport.user);
    await userInfoService.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
