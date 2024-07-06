import { ApplicationError } from '../../utils/error/applicationError';
import { BaseDietRecipe } from '../../types/food/DietRecipe';
import { UserModel, recipeModel, dietRecordModel } from '../../models';

export const getAll = async (date: Date, uid: number) => {
  const dietRecord = await dietRecordModel.getAllByDate(uid, date);
  const user = await UserModel.getOneById(uid);
  if (!user) throw new ApplicationError(400);
  const { carbs, pro, fats, kcal } = user;
  const target = { carbs, pro, fats, kcal };
  if (dietRecord) {
    const dietRecords = await Promise.all(
      dietRecord.map(async ({ id, amount, category, recipes }) => {
        const recipe = await recipeModel.getOne(recipes);
        return { id, amount, category, recipe };
      })
    );
    const data = { target, foods: dietRecords };
    return data;
  }
  return { target, foods: [] };
};

export const create = async ({ recipeId, dietDate, category, amount }: Pick<BaseDietRecipe, 'recipeId' | 'dietDate' | 'category' | 'amount'>, uid: number) => {
  const recipe = await recipeModel.getOne(recipeId);
  if (!recipe?.creator) throw new ApplicationError(409);
  if (recipe.creator !== uid) throw new ApplicationError(403);

  const result = await dietRecordModel.create(uid, dietDate, category, recipeId, amount);
  if (!result) throw new ApplicationError(400);
};

export const remove = async (dietRecordId: number, uid: number) => {
  const dietRecord = await dietRecordModel.getOne(dietRecordId);
  if (dietRecord?.creator !== uid) throw new ApplicationError(409);

  const result = await dietRecordModel.remove(dietRecordId);
  if (!result) throw new ApplicationError(404);
};
