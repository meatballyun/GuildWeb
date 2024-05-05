const passport = require('../../verification/passport.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/userModel');
const ApplicationError = require('../../utils/error/applicationError.js');

class LogInController {
  async login(req, res, next) {
    passport.authenticate('login', async function (err, user, info) {
      if (err) return next(new ApplicationError(500, err));
      if (!user) return next(new ApplicationError(401, info));
      if (user.STATUS === 'Pending') return next(new ApplicationError(403));

      req.login(user, function (err) {
        if (err) return next(new ApplicationError(403, err));
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const payload = {
          id: user.ID,
          email: user.EMAIL,
          name: user.NAME,
          iat: currentTimestamp,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        return res.status(200).json({ data: { token } });
      });
    })(req, res, next);
  }

  async signup(req, res, next) {
    const password = await new Promise((resolve, reject) => {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
    const query = await User.getOneByEmail(req.body.email);
    if (query?.length) return next(new ApplicationError(409));
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
}

module.exports = LogInController;
