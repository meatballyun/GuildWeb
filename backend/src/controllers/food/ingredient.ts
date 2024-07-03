import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { ingredientService } from '../../services/food';
import { userInfoService } from '../../services/user';

export class IngredientController {
  static async getIngredients(req: TypedRequest, res: Response, next: NextFunction) {
    const ingredients = await ingredientService.getAll(req.query, req.userId as number);
    return res.status(200).json({ data: ingredients });
  }

  static async getIngredientDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const ingredient = await ingredientService.getOne(req.params.id, req.userId as number);
    return res.status(200).json({ data: ingredient });
  }

  static async createIngredient(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await ingredientService.create(req.body, req.userId as number);
    await userInfoService.updateExp(req.userId as number, 1);
    return res.status(200).json({ data });
  }

  static async updateIngredient(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await ingredientService.update(req.params.id, req.body, req.userId as number);
    return res.status(200).json({ data });
  }

  static async deleteIngredients(req: TypedRequest, res: Response, next: NextFunction) {
    await ingredientService.remove(req.params.id, req.userId as number);
    await userInfoService.updateExp(req.userId as number, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
