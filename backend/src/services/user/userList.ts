import { ApplicationError } from '../../utils/error/applicationError';
import { UserModel, UserFriendModel } from '../../models/user';

type Status = 'confirmed' | 'pending' | 'blocked';

const getFriendship = async (currentUser: number, user: number) => {
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
};

export const getAllUser = async (uid: number, query: string) => {
  const users = await UserModel.getAllByName(query);
  let userList;
  if (users) {
    userList = await Promise.all(
      users.map(async ({ id, name, imageUrl, rank }) => {
        let status = await getFriendship(uid, id);
        if (!status) status = 'None';
        return { id, name, imageUrl, rank, status };
      })
    );
    return userList.filter((row) => {
      return uid !== row.id;
    });
  }
  return userList;
};

export const getAllFriend = async (uid: number, query: string) => {
  const friends = await UserFriendModel.getAllByIdAndName(uid, query);
  if (friends?.length) {
    const users = friends.map(({ id, name, imageUrl, rank }) => {
      return { id, name, imageUrl, rank };
    });
    return users.filter((user) => {
      return uid !== user.id;
    });
  }
  return [];
};

export const sendInvitation = async (uid: number, recipient: number) => {
  let status = await getFriendship(recipient, uid);
  if (status) throw new ApplicationError(409);
  const result = await UserFriendModel.create(uid, recipient);
  if (!result) throw new ApplicationError(404);
};

export const update = async (uid: number, oid: number, status: Status) => {
  const result = await UserFriendModel.update(oid, uid, status);
  if (!result) throw new ApplicationError(404);
};

export const remove = async (userToDelete: number, uid: number) => {
  let status = await getFriendship(userToDelete, uid);
  if (!status) throw new ApplicationError(409);
  const result = await UserFriendModel.delete(uid, userToDelete);
  if (!result) throw new ApplicationError(400);
};
