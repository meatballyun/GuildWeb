const DietRecordRepository = require('../../repositories/food/dietRecord.repository.js');
const UserInfoRepository = require('../../repositories/user/userInfo.repository.js');

class DietRecordController {
  static async getDietRecords(req, res, next) {
    const data = await DietRecordRepository.getAll(req.query.date, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async createDietRecord(req, res, next) {
    await DietRecordRepository.create(req.body, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, 1);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteDietRecord(req, res, next) {
    await DietRecordRepository.delete(req.params.id, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}

module.exports = DietRecordController;
