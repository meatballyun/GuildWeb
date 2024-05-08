const UserInfoRepository = require('../../repositories/user/userInfo.repository.js');

class UserInfoController {
  static async getUserInfo(req, res, next) {
    const user = await UserInfoRepository.getOne(req.session.passport.user);
    return res.status(200).json({ data: user });
  }

  static async updateUserInfo(req, res, next) {
    await UserInfoRepository.update(req.session.passport.user, req.body);
    return res.status(200).json({ data: 'OK' });
  }
}

module.exports = UserInfoController;
