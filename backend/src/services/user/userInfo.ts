import bcrypt from 'bcrypt';
import { ApplicationError } from '../../utils/error/applicationError';
import { toHash } from '../../utils/hashCode';
import { generateToken } from '../../utils/token/generateToken';
import { BaseUser } from '../../types/user/user';
import { UserModel } from '../../models';

const MAX_RANK = 15;
const BASE = 70;
const EXPONENT = 1.1;
const PARAMS = 50;

const getUpgradeExp = (rank: number) => {
  return +(EXPONENT ** rank * BASE).toFixed(0) - PARAMS;
};

const updateRank = async (uid: number, rank: number) => {
  await UserModel.updateExp(uid, 0);
  await UserModel.upgrade(uid, rank);
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  const user = await UserModel.getOneByEmail(email);
  if (!user) throw new ApplicationError(401, 'Email not found.');
  if (user?.status !== 'confirmed') throw new ApplicationError(403, 'Email is not yet verified');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new ApplicationError(401, 'Invalid password');

  const token = await generateToken(user.id, user.email);
  return token;
};

export const signup = async ({ email, password, name }: { email: string; password: string; name: string }) => {
  const hashPassword = await toHash(password);
  const query = await UserModel.getOneByEmail(email);
  if (query) throw new ApplicationError(409);
  const result = await UserModel.create(name, email, hashPassword);
  if (!result) throw new ApplicationError(400);
  return result;
};

export const resetPassword = async (uid: number, { password, newPassword }: { password: string; newPassword: string }) => {
  const user = await UserModel.getOneById(uid);
  if (!user) throw new ApplicationError(401, 'User not found.');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new ApplicationError(401, 'Invalid password');

  const hashPassword = await toHash(newPassword);
  const query = await UserModel.updatePassword(uid, hashPassword);
  if (!query) throw new ApplicationError(404);
};

export const getOne = async (uid: number) => {
  const user = await UserModel.getOneById(uid);
  if (!user) throw new ApplicationError(404);
  const upgradeExp = getUpgradeExp(user.rank);
  return { ...user, upgradeExp: upgradeExp };
};

export const update = async (uid: number, body: BaseUser) => {
  const result = await UserModel.updateInfo(uid, body);
  if (!result) throw new ApplicationError(404);
  return uid;
};

export const updateExp = async (uid: number, getEXP: number) => {
  const userInfo = await UserModel.getOneById(uid);
  if (!userInfo) throw new ApplicationError(404);
  const { rank, exp } = userInfo;

  if (rank === MAX_RANK) return 'OK';
  if (rank > MAX_RANK) {
    updateRank(uid, MAX_RANK);
    return 'OK';
  }
  let newEXP = getEXP + exp;
  if (newEXP < 0) newEXP = 0;
  await UserModel.updateExp(uid, newEXP);

  const upgradeExp = getUpgradeExp(rank);
  if (newEXP >= upgradeExp) await updateRank(uid, rank + 1);
};
