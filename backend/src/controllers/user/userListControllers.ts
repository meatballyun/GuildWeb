// @ts-nocheck
import UserListRepository from '../../repositories/user/userList.repository';
import UserInfoRepository from '../../repositories/user/userInfo.repository';

class UserListController {
  static async getUsers(req, res, next) {
    const data = await UserListRepository.getAllUser(req.session.passport.user, req.query.q);
    return res.status(200).json({ data });
  }

  static async getFriends(req, res, next) {
    const data = await UserListRepository.getAllFriend(req.session.passport.user, req.query.q);
    return res.status(200).json({ data });
  }

  static async sendInvitation(req, res, next) {
    await UserListRepository.sendInvitation(req.session.passport.user, req.body.uid);
    req.body.type = 'User';
    req.body.senderId = req.session.passport.user;
    req.body.recipientId = req.body.uid;
    next();
  }

  static async updateFriend(req, res, next) {
    await UserListRepository.update(req.session.passport.user, req.params.uid, req.body.status);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteFriend(req, res, next) {
    await UserListRepository.delete(req.params.uid, req.session.passport.user);
    await UserInfoRepository.updateExp(req.session.passport.user, -1);
    return res.status(200).json({ data: 'OK' });
  }
}

export default UserListController;
