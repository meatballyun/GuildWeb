import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { userInfoService } from '../../services/user';
import { recipeService } from '../../services/food';

export const getRecipes = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await recipeService.getAll(req.query, req.userId as number);
  return res.status(200).json({ data: data });
};

export const getRecipeDetail = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await recipeService.getOne(req.params.id, req.userId as number);
  return res.status(200).json({ data });
};

export const createRecipe = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await recipeService.create(req.body, req.userId as number);
  await userInfoService.updateExp(req.userId as number, 1);
  return res.status(200).json({ data });
};

export const updateRecipe = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await recipeService.update(req.body.id, req.body, req.userId as number);
  return res.status(200).json({ data });
};

export const deleteRecipe = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await recipeService.remove(req.params.id, req.userId as number);
  await userInfoService.updateExp(req.userId as number, -1);
  return res.status(200).json({ data: 'OK' });
};
