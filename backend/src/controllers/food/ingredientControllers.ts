import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { IngredientRepository } from '../../repositories/food/ingredient.repository';
import { UserInfoRepository } from '../../repositories/user/userInfo.repository';

export class IngredientController {
  static async getIngredients(req: TypedRequest, res: Response, next: NextFunction) {
    const ingredients = await IngredientRepository.getAll(req.query, req.session.passport.user);
    return res.status(200).json({ data: ingredients });
  }

  static async getIngredientDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const ingredient = await IngredientRepository.getOne(req.params.id, req.session.passport.user);
    return res.status(200).json({ data: ingredient });
  }

  static async createIngredient(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await IngredientRepository.create(req.body, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateIngredient(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await IngredientRepository.update(req.params.id, req.body, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteIngredients(req: TypedRequest, res: Response, next: NextFunction) {
    await IngredientRepository.delete(req.params.id, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}
