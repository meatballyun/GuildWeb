const ApplicationError = require('../../utils/error/applicationError.js');
const convertToCamelCase = require('../../utils/convertToCamelCase.js');
const User = require('../../models/user/user.model.js');

class UserInfoRepository {
  static #MAX_RANK = 15;
  static #BASE = 70;
  static #EXPONENT = 1.1;
  static #PARAMS = 50;

  static upgradeExp(rank) {
    return (this.#EXPONENT ** rank * this.#BASE).toFixed(0) - this.#PARAMS;
  }

  static async updateRank(uid, rank) {
    await User.updateExp(uid, 0);
    await User.upgrade(uid, rank);
  }

  static async getOne(uid) {
    const user = await User.getOneById(uid);
    if (!user) throw new ApplicationError(404);
    const upgradeExp = this.upgradeExp(user.rank);
    return { ...user, upgradeExp: upgradeExp };
  }

  static async update(uid, body) {
    const result = await User.updateInfo(uid, body);
    if (!result) throw new ApplicationError(404);
    return uid;
  }

  static async updateExp(uid, getEXP) {
    const userInfo = await User.getOneById(uid);
    if (!userInfo) throw new ApplicationError(404);
    const { rank, exp } = userInfo;

    if (rank === this.#MAX_RANK) return 'OK';
    if (rank > this.#MAX_RANK) {
      this.updateRank(uid, this.#MAX_RANK);
      return 'OK';
    }
    let newEXP = getEXP + exp;
    if (newEXP < 0) newEXP = 0;
    await User.updateExp(uid, newEXP);

    const upgradeExp = this.upgradeExp(rank);
    if (newEXP >= upgradeExp) await this.updateRank(uid, rank + 1);
  }
}

module.exports = UserInfoRepository;
