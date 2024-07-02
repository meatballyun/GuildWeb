import { ApplicationError } from '../../utils/error/applicationError';
import { BaseUser } from '../../types/user/user';
import { UserModel } from '../../models/user';

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
