const UserInfoRepository = new (require('../../repositories/user/userInfo.repository.js'))();

class UserInfoController {
  async getUserInfo(req, res, next) {
    const data = await UserInfoRepository.getOne(req.session.passport.user);
    return res.status(200).json({ data });
  }

  async updateUserInfo(req, res, next) {
    const data = await UserInfoRepository.update(req.session.passport.user, req.body);
    return res.status(200).json({ data: data });
  }

  async updateUserExp(ID, EXP) {
    const result = await UserInfoRepository.updateExp(ID, EXP);
    return result;
  }
}

module.exports = UserInfoController;
