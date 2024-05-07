const ApplicationError = require('../../utils/error/applicationError.js');
const convertToCamelCase = require('../../utils/convertToCamelCase.js');
const User = require('../../models/user/user.model.js');

const MAX_RANK = 15;
const BASE = 70;
const EXPONENT = 1.1;
const PARAMS = 50;

class UserInfoRepository {
  #upgradeExp(rank) {
    return (EXPONENT ** rank * BASE).toFixed(0) - PARAMS;
  }

  async #updateRank(uid, rank) {
    await User.updateExp(uid, 0);
    await User.upgrade(uid, rank);
    return true;
  }

  async getOne(uid) {
    const [userInfo] = await User.getOneById(uid);
    if (!userInfo) throw new ApplicationError(404);
    const upgradeExp = this.#upgradeExp(userInfo.RANK);
    await this.updateExp(uid, 0);
    return { ...convertToCamelCase(userInfo), upgradeExp: upgradeExp };
  }

  async update(uid, body) {
    const [userInfo] = await User.updateInfo(uid, body);
    if (!userInfo) throw new ApplicationError(404);
    return { id: uid };
  }

  async updateExp(uid, getEXP) {
    const [userInfo] = await User.getOneById(uid);
    if (!userInfo) throw new ApplicationError(404);
    const { RANK, EXP } = userInfo;

    if (RANK === MAX_RANK) return 'OK';
    if (RANK > MAX_RANK) {
      this.#updateRank(uid, MAX_RANK);
      return 'OK';
    }
    let newEXP = getEXP + EXP;
    if (newEXP < 0) newEXP = 0;
    await User.updateExp(uid, newEXP);

    const upgradeExp = this.#upgradeExp(RANK);
    if (newEXP >= upgradeExp) await this.#updateRank(uid, RANK + 1);

    return 'OK';
  }
}

module.exports = UserInfoRepository;
