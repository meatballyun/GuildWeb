const IngredientRepository = new (require('../../repositories/food/ingredient.repository.js'))();
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

class IngredientController {
  async getIngredients(req, res, next) {
    const data = await IngredientRepository.getAll(req.session.passport.user, req.query);
    return res.status(200).json({ data });
  }

  async getIngredientDetail(req, res, next) {
    const data = await IngredientRepository.getOne(req.session.passport.user, req.params.id);
    return res.status(200).json({ data });
  }

  async createIngredient(req, res, next) {
    const data = await IngredientRepository.create(req.session.passport.user, req.body);
    updateUserExp(req.session.passport.user, 1);
    return res.status(200).json({ data: data });
  }

  async updateIngredient(req, res, next) {
    const data = await IngredientRepository.update(
      req.session.passport.user,
      req.body,
      req.params.id
    );
    return res.status(200).json({ data });
  }

  async deleteIngredients(req, res, next) {
    const result = await IngredientRepository.delete(req.session.passport.user, req.params.id);
    updateUserExp(req.session.passport.user, -1);
    return res.status(200).json({ result });
  }
}

module.exports = IngredientController;
