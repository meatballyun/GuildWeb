import { ApplicationError } from '../../utils/error/applicationError';
import { BaseDietRecipe } from '../../types/food/DietRecipe';
import { DietRecordModel } from '../../models/food/dietRecord.model';
import { RecipeModel } from '../../models/food/recipe.model';
import { UserModel } from '../../models/user/user.model';

export class DietRecordRepository {
  static async getAll(date: Date, uid: number) {
    const dietRecord = await DietRecordModel.getAllByDate(uid, date);
    const user = await UserModel.getOneById(uid);
    if (!user) throw new ApplicationError(400);
    const { carbs, pro, fats, kcal } = user;
    const target = { carbs, pro, fats, kcal };
    if (dietRecord) {
      const dietRecords = await Promise.all(
        dietRecord.map(async ({ id, amount, category, recipes }) => {
          const recipe = await RecipeModel.getOne(recipes);
          return { id, amount, category, recipe };
        })
      );
      const data = { target, foods: dietRecords };
      return data;
    }
    return { target, foods: [] };
  }

  static async create({ recipeId, dietDate, category, amount }: Pick<BaseDietRecipe, 'recipeId' | 'dietDate' | 'category' | 'amount'>, uid: number) {
    const recipe = await RecipeModel.getOne(recipeId);
    if (!recipe?.creator) throw new ApplicationError(409);
    if (recipe.creator !== uid) throw new ApplicationError(403);

    const result = await DietRecordModel.create(uid, dietDate, category, recipeId, amount);
    if (!result) throw new ApplicationError(400);
  }

  static async delete(dietRecordId: number, uid: number) {
    const dietRecord = await DietRecordModel.getOne(dietRecordId);
    if (dietRecord?.creator !== uid) throw new ApplicationError(409);

    const result = await DietRecordModel.delete(dietRecordId);
    if (!result) throw new ApplicationError(404);
  }
}
