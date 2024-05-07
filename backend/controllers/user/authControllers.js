const passport = require('../../verification/passport.js');
const jwt = require('jsonwebtoken');
const { hasher } = require('../../utils/hashCode.js');
const User = require('../../models/user/user.model.js');
const ApplicationError = require('../../utils/error/applicationError.js');
const ConfirmationEmail = require('../../models/email/confirmationEmail.model.js');

class AuthController {
  async login(req, res, next) {
    passport.authenticate('login', async function (err, user, info) {
      try {
        if (err) throw new ApplicationError(500, err);
        if (!user) throw new ApplicationError(401, info);
        if (user.STATUS === 'Pending') throw new ApplicationError(403);

        req.login(user, (err) => {
          console.log(user.NAME);
          if (err) throw new ApplicationError(403, err);
          const currentTimestamp = Math.floor(Date.now() / 1000);
          const payload = {
            id: user.ID,
            email: user.EMAIL,
            name: user.NAME,
            iat: currentTimestamp,
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
          console.log(token);
          return res.status(200).json({ data: { token } });
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  }

  async signup(req, res, next) {
    const password = await hasher(req.body.password);
    const query = await User.getOneByEmail(req.body.email);
    if (query?.length) throw new ApplicationError(409);
    const signUp = await User.create(req.body.name, req.body.email, password);
    if (signUp.affectedRows) {
      req.body.uid = signUp.insertId;
      next();
    }
  }

  async logout(req, res) {
    req.logout(() => {
      res.status(200).json({ data: 'Ok' });
    });
  }

  async resetPassword(req, res, next) {
    const [confirmationMail] = await ConfirmationEmail.getAllByUser(req.body.uid, 'ForgotPassword');
    if (
      confirmationMail.STATUS !== 'Confirmed' ||
      new Date(confirmationMail.CREATE_TIME).valueOf() + 86400000 < new Date().valueOf()
    )
      return next(new ApplicationError(403));

    if (confirmationMail.CODE === req.body.code) {
      const password = await hasher(req.body.password);
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
