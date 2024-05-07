const DietRecordRepository = new (require('../../repositories/food/dietRecord.repository.js'))();
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

class DietRecordController {
  async getDietRecords(req, res, next) {
    const result = await DietRecordRepository.getAll(req.session.passport.user, req.query.date);
    return res.status(200).json({ data: result });
  }

  async createDietRecord(req, res, next) {
    const result = await DietRecordRepository.create(req.session.passport.user, req.body);
    await updateUserExp(1, req.session.passport.user);
    return res.status(200).json({ data: result });
  }

  async deleteDietRecord(req, res, next) {
    const result = await DietRecordRepository.delete(req.session.passport.user, req.params.id);
    await updateUserExp(-1, req.session.passport.user);
    return res.status(200).json({ data: result });
  }
}

module.exports = DietRecordController;
