const { hashCode } = require('../../utils/hashCode.js');
const ApplicationError = require('../../utils/error/applicationError.js');
const ConfirmationEmail = require('../../models/email/confirmationEmail.model.js');
const User = require('../../models/user/user.model.js');

class UserInfoController {
  async getUserInfo(req, res, next) {
    const [userInfo] = await User.getOneById(req.session.passport.user);
    if (userInfo) {
      const upgradeExp = (userInfo.RANK ** 2.8 * 10).toFixed(0);
      res.status(200).json({
        data: {
          id: userInfo.ID,
          name: userInfo.NAME,
          email: userInfo.EMAIL,
          imageUrl: userInfo.IMAGE_URL,
          rank: userInfo.RANK,
          exp: userInfo.EXP,
          upgradeExp: upgradeExp,
          carbs: userInfo.CARBS,
          pro: userInfo.PRO,
          fats: userInfo.FATS,
          kcal: userInfo.KCAL,
        },
      });
    } else {
      return next(new ApplicationError(404));
    }
  }

  async resetPassword(req, res, next) {
    const [confirmationMail] = await ConfirmationEmail.getAllByUser(req.body.uid, 'ForgotPassword');
    if (
      confirmationMail.STATUS !== 'Confirmed' ||
      new Date(confirmationMail.CREATE_TIME).valueOf() + 86400000 < new Date().valueOf()
    )
      return next(new ApplicationError(403));

    if (confirmationMail.CODE === req.body.code) {
      const password = hasher(req.body.password);
      const query = await User.updatePassword(req.body.uid, password);
      if (query.affectedRows) {
        return res.status(200).json({ data: 'OK' });
      } else {
        return next(new ApplicationError(404));
      }
    }
  }

  async updateUserInfo(req, res, next) {
    const query = await User.updateInfo(
      req.session.passport.user,
      req.body.name,
      req.body.imageUrl,
      req.body.carbs,
      req.body.pro,
      req.body.fats,
      req.body.kcal
    );
    if (query.affectedRows) {
      return res.status(200).json({ data: { id: req.session.passport.user } });
    } else {
      return next(new ApplicationError(404));
    }
  }

  async updateUserExp(EXP, ID) {
    const [userInfo] = await User.getOneById(ID);
    if (userInfo.RANK === 99) return;
    const newEXP = EXP + userInfo.EXP;
    if (newEXP < 0) newEXP = 0;
    await User.updateExp(newEXP, ID);

    const upgradeExp = (userInfo.RANK ** 2.8 * 10).toFixed(0);
    if (newEXP >= upgradeExp) {
      await User.upgrade(userInfo.RANK + 1, ID);
      await User.updateExp(0, ID);
    }
    return;
  }
}

module.exports = UserInfoController;
