const passport = require('../../verification/passport.js');
const jwt = require('jsonwebtoken');
const { toHash } = require('../../utils/hashCode.js');
const User = require('../../models/user/user.model.js');
const ApplicationError = require('../../utils/error/applicationError.js');
const ConfirmationEmail = require('../../models/email/confirmationEmail.model.js');

class AuthController {
  static async login(req, res, next) {
    passport.authenticate('login', async function (err, user, info) {
      try {
        if (err) throw new ApplicationError(500, err);
        if (!user) throw new ApplicationError(401, info);
        if (user.STATUS === 'Pending') throw new ApplicationError(403);

        req.login(user, (err) => {
          if (err) throw new ApplicationError(403, err);
          const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            iat: Math.floor(Date.now() / 1000),
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
          return res.status(200).json({ data: { token } });
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  }

  static async signup(req, res, next) {
    const password = await toHash(req.body.password);
    const query = await User.getOneByEmail(req.body.email);
    if (query?.length) throw new ApplicationError(409);
    const signUp = await User.create(req.body.name, req.body.email, password);
    if (signUp.affectedRows) {
      req.body.uid = signUp.insertId;
      next();
    }
  }

  static async logout(req, res) {
    req.logout(() => {
      res.status(200).json({ data: 'Ok' });
    });
  }

  static async resetPassword(req, res, next) {
    const [confirmationMail] = await ConfirmationEmail.getAllByUser(req.body.uid, 'ForgotPassword');
    if (
      confirmationMail.STATUS !== 'Confirmed' ||
      new Date(confirmationMail.CREATE_TIME).valueOf() + 86400000 < new Date().valueOf()
    )
      return next(new ApplicationError(403));

    if (confirmationMail.CODE === req.body.code) {
      const password = await toHash(req.body.password);
      const query = await User.updatePassword(req.body.uid, password);
      if (query.affectedRows) {
        return res.status(200).json({ data: 'OK' });
      } else {
        return next(new ApplicationError(404));
      }
    }
  }
}

module.exports = AuthController;
