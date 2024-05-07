const ApplicationError = require('../../utils/error/applicationError.js');
const convertToCamelCase = require('../../utils/convertToCamelCase.js');
const DietRecord = require('../../models/food/dietRecord.model.js');
const Recipe = require('../../models/food/recipe.model.js');
const User = require('../../models/user/user.model.js');

class DietRecordRepository {
  async getAll(uid, date) {
    const [userinfo] = await User.getOneById(uid);
    const dietRecord = await DietRecord.getAllByDate(uid, date);
    const hasDietRecord = dietRecord?.length;
    if (hasDietRecord) {
      const dietRecords = await Promise.all(
        dietRecord.map(async (rows) => {
          const [getRecipe] = await Recipe.getOne(rows.RECIPES);
          const recipe = convertToCamelCase(getRecipe);
          return {
            id: rows.ID,
            amount: rows.AMOUNT,
            category: rows.CATEGORY,
            recipe: recipe,
          };
        })
      );
      const data = {
        target: {
          carbs: userinfo.CARBS,
          pro: userinfo.PRO,
          fats: userinfo.FATS,
          kcal: userinfo.KCAL,
        },
        foods: dietRecords,
      };

      return data;
    }
    const data = {
      target: {
        carbs: userinfo.CARBS,
        pro: userinfo.PRO,
        fats: userinfo.FATS,
        kcal: userinfo.KCAL,
      },
      foods: [],
    };

    return data;
  }

  async create(uid, body) {
    const [recipe] = await Recipe.getOne(body.recipe);
    if (!recipe) throw new ApplicationError(409);
    if (recipe.CREATOR !== uid) throw new ApplicationError(403);
    const query = await DietRecord.create(uid, body.date, body.category, body.recipe, body.amount);
    if (query['insertId']) return 'OK';
    throw new ApplicationError(400);
  }

  async delete(uid, id) {
    const [dietRecord] = await DietRecord.getOne(id);
    if (dietRecord.CREATOR !== uid) throw new ApplicationError(409);
    const result = await DietRecord.delete(id);
    if (result['changedRows']) return 'OK';
    return next(new ApplicationError(404));
  }
}

module.exports = DietRecordRepository;
