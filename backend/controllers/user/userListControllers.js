const ApplicationError = require('../../utils/error/applicationError.js');
const User = require('../../models/userModel');
const UserFriend = require('../../models/userFriendModel');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

class UserListController {
  async getUsers(req, res, next) {
    const query = await User.getAll(req.query.q);
    let users = [];
    if (query?.length) {
      users = await Promise.all(
        query.map(async (row) => {
          let status = 'None';
          const query = await UserFriend.getStatus(req.session.passport.user, row.ID);
          if (query[0]?.STATUS === 'Confirmed') status = 'Confirmed';
          else if (query[0]?.STATUS === 'Pending') status = 'Pending Response';
          else {
            const q = await UserFriend.getStatus(row.ID, req.session.passport.user);
            if (q[0]?.STATUS === 'Confirmed') status = 'Confirmed';
            else if (q[0]?.STATUS === 'Pending') status = 'Pending Confirmation';
          }
          return {
            id: row.ID,
            name: row.NAME,
            imageUrl: row.IMAGE_URL,
            rank: row.RANK,
            status: status,
          };
        })
      );
      return res.status(200).json({
        data: users.filter((row) => {
          return req.session.passport.user !== row.id;
        }),
      });
    }
    return res.status(200).json({ data: users });
  }

  async getFriends(req, res, next) {
    const query = await UserFriend.getAllByIdAndName(req.session.passport.user, req.query.q);
    let users;
    if (query?.length) {
      users = query.map((row) => ({
        id: row.ID,
        name: row.NAME,
        imageUrl: row.IMAGE_URL,
        rank: row.RANK,
      }));
      return res.status(200).json({
        data: users.filter((row) => {
          return req.session.passport.user !== row.id;
        }),
      });
    }
    return res.status(200).json({ data: users });
  }
  async sendInvitation(req, res, next) {
    const status = await UserFriend.getStatus(req.body.uid, req.session.passport.user);
    if (status?.length) return next(new ApplicationError(409));
    const query = await UserFriend.create(req.session.passport.user, req.body.uid);
    if (query['affectedRows']) {
      req.body.type = 'User';
      req.body.senderId = req.session.passport.user;
      req.body.recipientId = req.body.uid;
      next();
    } else return next(new ApplicationError(404));
  }

  async updateFriend(req, res, next) {
    const query = await UserFriend.update(
      req.params.uid,
      req.session.passport.user,
      req.body.status
    );
    if (query.affectedRows) {
      await updateUserExp(1, req.params.uid);
      await updateUserExp(1, req.session.passport.user);
      return res.status(200).json({ data: 'OK' });
    }
    return next(new ApplicationError(404));
  }

  async deleteFriend(req, res, next) {
    const query = await UserFriend.delete(req.session.passport.user, req.params.uid);
    if (query.affectedRows) {
      await updateUserExp(-1, req.params.uid);
      await updateUserExp(-1, req.session.passport.user);
      return res.status(200).json({ data: 'OK' });
    }
    return next(new ApplicationError(404));
  }
}

module.exports = UserListController;
