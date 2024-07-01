import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { IngredientService } from '../../services/food/ingredient';
import { UserInfoService } from '../../services/user/userInfo';

export class IngredientController {
  static async getIngredients(req: TypedRequest, res: Response, next: NextFunction) {
    const ingredients = await IngredientService.getAll(req.query, req.session.passport.user);
    return res.status(200).json({ data: ingredients });
  }

  static async getIngredientDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const ingredient = await IngredientService.getOne(req.params.id, req.session.passport.user);
    return res.status(200).json({ data: ingredient });
  }

  static async createIngredient(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await IngredientService.create(req.body, req.session.passport.user);
    await UserInfoService.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateIngredient(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await IngredientService.update(req.params.id, req.body, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteIngredients(req: TypedRequest, res: Response, next: NextFunction) {
    await IngredientService.delete(req.params.id, req.session.passport.user);
    await UserInfoService.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
