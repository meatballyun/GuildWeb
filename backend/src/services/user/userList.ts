import { ApplicationError } from '../../utils/error/applicationError';
import { UserModel } from '../../models/user/user';
import { UserFriendModel } from '../../models/user/userFriend';

type Status = 'confirmed' | 'pending' | 'blocked';

export class UserListService {
  static async getFriendship(currentUser: number, user: number) {
    let friendship;
    let status = await UserFriendModel.getStatus(currentUser, user);
    if (status) {
      if (status === 'confirmed') friendship = 'confirmed';
      else if (status === 'pending') friendship = 'pending response';
      else friendship = 'blocked';
      return friendship;
    }
    status = await UserFriendModel.getStatus(user, currentUser);
    if (status) {
      if (status === 'confirmed') friendship = 'confirmed';
      else if (status === 'pending') friendship = 'pending confirmation';
      else friendship = 'blocked';
    }
    return friendship;
  }

  static async getAllUser(uid: number, query: string) {
    const users = await UserModel.getAllByName(query);
    let userList;
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

  static async getAllFriend(uid: number, query: string) {
    const friends = await UserFriendModel.getAllByIdAndName(uid, query);
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

  static async sendInvitation(uid: number, recipient: number) {
    let status = await this.getFriendship(recipient, uid);
    if (status) throw new ApplicationError(409);
    const result = await UserFriendModel.create(uid, recipient);
    if (!result) throw new ApplicationError(404);
  }

  static async update(uid: number, oid: number, status: Status) {
    const result = await UserFriendModel.update(oid, uid, status);
    if (!result) throw new ApplicationError(404);
  }

  static async delete(userToDelete: number, uid: number) {
    let status = await this.getFriendship(userToDelete, uid);
    if (!status) throw new ApplicationError(409);
    const result = await UserFriendModel.delete(uid, userToDelete);
    if (!result) throw new ApplicationError(400);
  }
}
