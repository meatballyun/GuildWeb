const IngredientRepository = require('../../repositories/food/ingredient.repository.js');
const UserInfoRepository = require('../../repositories/user/userInfo.repository.js');

class IngredientController {
  static async getIngredients(req, res, next) {
    console.log(req.query.q);
    const ingredients = await IngredientRepository.getAll(req.query, req.session.passport.user);
    return res.status(200).json({ data: ingredients });
  }

  static async getIngredientDetail(req, res, next) {
    const ingredient = await IngredientRepository.getOne(req.params.id, req.session.passport.user);
    return res.status(200).json({ data: ingredient });
  }

  static async createIngredient(req, res, next) {
    const data = await IngredientRepository.create(req.body, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data });
  }

  static async updateIngredient(req, res, next) {
    const data = await IngredientRepository.update(
      req.params.id,
      req.body,
      req.session.passport.user
    );
    return res.status(200).json({ data });
  }

  static async deleteIngredients(req, res, next) {
    await IngredientRepository.delete(req.params.id, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}

module.exports = IngredientController;
