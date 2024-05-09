const ApplicationError = require('../../utils/error/applicationError.js');
const User = require('../../models/user/user.model.js');
const UserFriend = require('../../models/user/userFriend.model');

class UserListRepository {
  static async getFriendship(currentUser, user) {
    let friendship = false;
    let status = await UserFriend.getStatus(currentUser, user);
    if (status) {
      if (status === 'Confirmed') friendship = 'Confirmed';
      else if (status === 'Pending') friendship = 'Pending Response';
      else friendship = 'Blocked';
      return friendship;
    }
    status = await UserFriend.getStatus(user, currentUser);
    if (status) {
      if (status === 'Confirmed') friendship = 'Confirmed';
      else if (status === 'Pending') friendship = 'Pending Confirmation';
      else friendship = 'Blocked';
    }
    return friendship;
  }

  static async getAllUser(uid, query) {
    const users = await User.getAllByName(query);
    let userList = [];
    if (users) {
      userList = await Promise.all(
        users.map(async ({ id, name, imageUrl, rank }) => {
          let status = await this.getFriendship(uid, id);
          if (!status) status = 'None';
          return { id, name, imageUrl, rank, status };
        })
      );
      return userList.filter((row) => {
        return uid !== row.id;
      });
    }
    return userList;
  }

  static async getAllFriend(uid, query) {
    const friends = await UserFriend.getAllByIdAndName(uid, query);
    if (friends) {
      const users = friends.map(({ id, name, imageUrl, rank }) => {
        return { id, name, imageUrl, rank };
      });
      return users.filter((user) => {
        return uid !== user.id;
      });
    }
    return [];
  }

  static async sendInvitation(uid, recipient) {
    let status = await this.getFriendship(recipient, uid);
    if (status) throw new ApplicationError(409);
    const result = await UserFriend.create(uid, recipient);
    if (!result) throw new ApplicationError(404);
  }

  static async update(uid, oid, status) {
    const result = await UserFriend.update(oid, uid, status);
    if (!result) throw new ApplicationError(404);
  }

  static async delete(userToDelete, uid) {
    let status = await this.getFriendship(userToDelete, uid);
    if (!status) throw new ApplicationError(409);
    const result = await UserFriend.delete(uid, userToDelete);
    if (!result) throw new ApplicationError(400);
  }
}

module.exports = UserListRepository;
