const ApplicationError = require('../../utils/error/applicationError.js');
const convertToCamelCase = require('../../utils/convertToCamelCase.js');
const User = require('../../models/user/user.model.js');
const UserFriend = require('../../models/user/userFriend.model');

class UserListRepository {
  async getAllUser(uid, query) {
    const getUsers = await User.getAllByName(query);
    let userList = [];
    const hasUsers = getUsers?.length;
    if (hasUsers) {
      userList = await Promise.all(
        getUsers.map(async (user) => {
          const { id, name, imageUrl, rank } = convertToCamelCase(user);
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

  async getAllFriend(uid, query) {
    const getUsers = await UserFriend.getAllByIdAndName(uid, query);
    let users;
    if (getUsers?.length) {
      users = getUsers.map((row) => {
        const { id, name, imageUrl, rank } = convertToCamelCase(row);
        return { id, name, imageUrl, rank };
      });
      return users.filter((row) => {
        return uid !== row.id;
      });
    }
    return users;
  }

  async sendInvitation(uid, recipient) {
    let status = await this.getFriendship(recipient, uid);
    if (status) throw new ApplicationError(409);
    const result = await UserFriend.create(uid, recipient);
    if (!result['affectedRows']) throw new ApplicationError(404);
    return true;
  }

  async getFriendship(querier, user) {
    let status = false;
    let friendship = await UserFriend.getStatus(querier, user);
    if (friendship) {
      if (friendship.STATUS === 'Confirmed') status = 'Confirmed';
      else if (friendship.STATUS === 'Pending') status = 'Pending Response';
      else status = 'Blocked';
      return status;
    }
    friendship = await UserFriend.getStatus(user, querier);
    if (friendship) {
      if (friendship.STATUS === 'Confirmed') status = 'Confirmed';
      else if (friendship.STATUS === 'Pending') status = 'Pending Confirmation';
      else status = 'Blocked';
    }
    return status;
  }

  async update(uid, oid, status) {
    const result = await UserFriend.update(oid, uid, status);
    if (!result['affectedRows']) throw new ApplicationError(404);
    return 'OK';
  }

  async delete(uid, oid) {
    let status = await this.getFriendship(recipient, uid);
    if (!status) throw new ApplicationError(409);
    const result = await UserFriend.delete(uid, oid);
    if (!result['affectedRows']) throw new ApplicationError(400);
    return 'OK';
  }
}

module.exports = UserListRepository;
