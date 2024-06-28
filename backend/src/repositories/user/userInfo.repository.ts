import { ApplicationError } from '../../utils/error/applicationError';
import { BaseUser } from '../../types/user/user';
import { UserModel } from '../../models/user/user.model';

export class UserInfoRepository {
  static #MAX_RANK = 15;
  static #BASE = 70;
  static #EXPONENT = 1.1;
  static #PARAMS = 50;

  static upgradeExp(rank: number) {
    return +(this.#EXPONENT ** rank * this.#BASE).toFixed(0) - this.#PARAMS;
  }

  static async updateRank(uid: number, rank: number) {
    await UserModel.updateExp(uid, 0);
    await UserModel.upgrade(uid, rank);
  }

  static async getOne(uid: number) {
    const user = await UserModel.getOneById(uid);
    if (!user) throw new ApplicationError(404);
    const upgradeExp = this.upgradeExp(user.rank);
    return { ...user, upgradeExp: upgradeExp };
  }

  static async update(uid: number, body: BaseUser) {
    const result = await UserModel.updateInfo(uid, body);
    if (!result) throw new ApplicationError(404);
    return uid;
  }

  static async updateExp(uid: number, getEXP: number) {
    const userInfo = await UserModel.getOneById(uid);
    if (!userInfo) throw new ApplicationError(404);
    const { rank, exp } = userInfo;

    if (rank === this.#MAX_RANK) return 'OK';
    if (rank > this.#MAX_RANK) {
      this.updateRank(uid, this.#MAX_RANK);
      return 'OK';
    }
    let newEXP = getEXP + exp;
    if (newEXP < 0) newEXP = 0;
    await UserModel.updateExp(uid, newEXP);

    const upgradeExp = this.upgradeExp(rank);
    if (newEXP >= upgradeExp) await this.updateRank(uid, rank + 1);
  }
}
