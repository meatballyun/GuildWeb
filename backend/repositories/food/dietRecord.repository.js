const ApplicationError = require('../../utils/error/applicationError.js');
const DietRecord = require('../../models/food/dietRecord.model.js');
const Recipe = require('../../models/food/recipe.model.js');
const User = require('../../models/user/user.model.js');

class DietRecordRepository {
  static async getAll(date, uid) {
    const dietRecord = await DietRecord.getAllByDate(uid, date);
    const { carbs, pro, fats, kcal } = await User.getOneById(uid);
    const target = { carbs, pro, fats, kcal };
    if (dietRecord) {
      const dietRecords = await Promise.all(
        dietRecord.map(async ({ id, amount, category, recipes }) => {
          const recipe = await Recipe.getOne(recipes);
          return { id, amount, category, recipe };
        })
      );
      const data = { target, foods: dietRecords };
      return data;
    }
    return { target, foods: [] };
  }

  static async create({ recipe, date, category, amount }, uid) {
    const { creator } = await Recipe.getOne(recipe);
    if (!creator) throw new ApplicationError(409);
    if (creator !== uid) throw new ApplicationError(403);

    const result = await DietRecord.create(uid, date, category, recipe, amount);
    if (!result) throw new ApplicationError(400);
  }

  static async delete(dietRecordId, uid) {
    const dietRecord = await DietRecord.getOne(dietRecordId);
    if (dietRecord.creator !== uid) throw new ApplicationError(409);

    const result = await DietRecord.delete(dietRecordId);
    if (!result) throw new ApplicationError(404);
  }
}

module.exports = DietRecordRepository;
