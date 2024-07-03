import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { userInfoService } from '../../services/user';
import { recipeService } from '../../services/food';

export class RecipeController {
  static async getRecipes(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await recipeService.getAll(req.query, req.userId as number);
    return res.status(200).json({ data: data });
  }

  static async getRecipeDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await recipeService.getOne(req.params.id, req.userId as number);
    return res.status(200).json({ data });
  }

  static async createRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await recipeService.create(req.body, req.userId as number);
    await userInfoService.updateExp(req.userId as number, 1);
    return res.status(200).json({ data });
  }

  static async updateRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await recipeService.update(req.params.id, req.body, req.userId as number);
    return res.status(200).json({ data });
  }

  static async deleteRecipe(req: TypedRequest, res: Response, next: NextFunction) {
    await recipeService.remove(req.params.id, req.userId as number);
    await userInfoService.updateExp(req.userId as number, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
