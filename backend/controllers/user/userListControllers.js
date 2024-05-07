const ApplicationError = require('../../utils/error/applicationError.js');
const UserFriend = require('../../models/user/userFriend.model');
const UserListRepository = new (require('../../repositories/user/userList.repository.js'))();
const UserInfoRepository = new (require('../../repositories/user/userInfo.repository.js'))();

class UserListController {
  async getUsers(req, res, next) {
    const data = await UserListRepository.getAllUser(req.session.passport.user, req.query.q);
    return res.status(200).json({ data });
  }

  async getFriends(req, res, next) {
    const data = await UserListRepository.getAllFriend(req.session.passport.user, req.query.q);
    return res.status(200).json({ data });
  }

  async sendInvitation(req, res, next) {
    await UserListRepository.sendInvitation(req.session.passport.user, req.body.uid);
    req.body.type = 'User';
    req.body.senderId = req.session.passport.user;
    req.body.recipientId = req.body.uid;
    next();
  }

  async updateFriend(req, res, next) {
    const result = await UserListRepository.update(
      req.session.passport.user,
      req.params.uid,
      req.body.status
    );
    return res.status(200).json({ data: result });
  }

  async deleteFriend(req, res, next) {
    const result = await UserListRepository.delete(req.session.passport.user, req.params.uid);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: result });
  }
}

module.exports = UserListController;
