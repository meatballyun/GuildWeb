const User = require('../../models/userModel');
const UserFriend = require('../../models/userFriendModel');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;
const ApplicationError = require('../../utils/error/applicationError.js');

class UserListController {
  async getUsers(req, res, next) {
    try {
      const query = await User.getUserByName(req.query.q);
      if (query?.length) {
        const users = await Promise.all(
          query.map(async (row) => {
            let status = 'None';
            const query = await UserFriend.getFriendStatus(req.session.passport.user, row.ID);
            if (query[0]?.STATUS === 'Confirmed') status = 'Confirmed';
            else if (query[0]?.STATUS === 'Pending') status = 'Pending Response';
            else {
              const q = await UserFriend.getFriendStatus(row.ID, req.session.passport.user);
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
          success: true,
          message: 'User data retrieval successful',
          data: users.filter((row) => {
            return req.session.passport.user !== row.id;
          }),
        });
      } else {
        const users = [];
        return res.status(200).json({
          success: true,
          message: 'User data retrieval successful',
          data: users,
        });
      }
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async getFriends(req, res, next) {
    try {
      const query = await UserFriend.getFriendsByIdAndName(req.session.passport.user, req.query.q);
      let users;
      if (query?.length) {
        users = query.map((row) => ({
          id: row.ID,
          name: row.NAME,
          imageUrl: row.IMAGE_URL,
          rank: row.RANK,
        }));

        return res.status(200).json({
          success: true,
          message: 'User data retrieval successful',
          data: users.filter((row) => {
            return req.session.passport.user !== row.id;
          }),
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'User data retrieval successful',
          data: users,
        });
      }
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async sendInvitation(req, res, next) {
    try {
      const status = await UserFriend.getFriendStatus(req.body.uid, req.session.passport.user);
      if (status?.length) return next(new ApplicationError(409));
      const query = await UserFriend.addFriend(req.session.passport.user, req.body.uid);
      if (query['affectedRows']) {
        req.body.type = 'User';
        req.body.senderId = req.session.passport.user;
        req.body.recipientId = req.body.uid;
        next();
      } else {
        return next(new ApplicationError(404));
      }
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY')
        return next(new ApplicationError(409, 'Cannot add duplicate friend relationship.'));
      return next(new ApplicationError(400, err));
    }
  }

  async updateFriend(req, res, next) {
    try {
      const query = await UserFriend.updateFriend(
        req.params.uid,
        req.session.passport.user,
        req.body.status
      );
      if (query.affectedRows) {
        await updateUserExp(1, req.params.uid);
        await updateUserExp(1, req.session.passport.user);

        return res.status(200).json({
          success: true,
          message: 'Data updated successfully.',
          data: 'OK',
        });
      } else {
        return next(new ApplicationError(404));
      }
    } catch (err) {
      return next(new ApplicationError(400));
    }
  }

  async deleteFriend(req, res, next) {
    try {
      const query = await UserFriend.deleteFriend(req.session.passport.user, req.params.uid);
      if (query.affectedRows) {
        await updateUserExp(-1, req.params.uid);
        await updateUserExp(-1, req.session.passport.user);
        return res.status(200).json({
          success: true,
          message: 'UserFriend record successfully deleted.',
          data: 'OK',
        });
      } else {
        return next(new ApplicationError(404));
      }
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }
}

module.exports = UserListController;
