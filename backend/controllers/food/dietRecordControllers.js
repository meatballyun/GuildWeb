const ApplicationError = require('../../utils/error/applicationError.js');
const DietRecord = require('../../models/dietRecordModel.js');
const Recipe = require('../../models/recipeModel.js');
const User = require('../../models/userModel.js');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

class DietRecordController {
  async getDietRecords(req, res, next) {
    const [userinfo] = await User.getOneById(req.session.passport.user);
    const query = await DietRecord.getAllByDate(req.session.passport.user, req.query.date);
    if (query?.length) {
      const dietRecords = await Promise.all(
        query.map(async (rows) => {
          const [row] = await Recipe.getOne(rows.RECIPES);
          const recipe = {
            id: row.ID,
            name: row.NAME,
            carbs: row.CARBS,
            pro: row.PRO,
            fats: row.FATS,
            kcal: row.KCAL,
            unit: row.UNIT,
            imageUrl: row.IMAGE_URL,
          };
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

      return res.status(200).json({ data });
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

    return res.status(200).json({ data });
  }

  async createDietRecord(req, res, next) {
    const [getRecipe] = await Recipe.getOne(req.body.recipe);
    if (!getRecipe) return next(new ApplicationError(409));
    if (getRecipe.CREATOR !== req.session.passport.user) return next(new ApplicationError(403));
    const query = await DietRecord.create(
      req.session.passport.user,
      req.body.date,
      req.body.category,
      req.body.recipe,
      req.body.amount
    );
    if (query.affectedRows) {
      await updateUserExp(1, req.session.passport.user);
      return res.status(200).json({ data: 'OK' });
    }
    return next(new ApplicationError(404));
  }

  async deleteDietRecord(req, res, next) {
    const query = await DietRecord.delete(req.params.id);
    if (query.changedRows) return res.status(200).json({ data: 'OK' });
    return next(new ApplicationError(404));
  }
}

module.exports = DietRecordController;
