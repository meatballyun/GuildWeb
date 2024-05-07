const passport = require('passport');
const bcrypt = require('bcrypt');
const { hasher, comparer } = require('../utils/hashCode.js');

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/user/user.model.js');

passport.serializeUser(function (user, done) {
  done(null, user.ID);
});

passport.deserializeUser(async function (id, done) {
  const user = await UserModel.getOneById(id);
  const hasUser = user?.length;
  if (!hasUser) return done(null, false, { message: 'Wrong deserializeUser' });
  done(null, JSON.parse(JSON.stringify(user[0])));
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async function (payload, done) {
    const user = await UserModel.getOneByEmail(payload.email);
    const hasUser = user?.length;
    if (!hasUser) return done(null, false, { message: 'Wrong JWT Token' });
    if (payload.email !== user[0].EMAIL) return done(null, false, { message: 'Wrong JWT Token' });
    const exp = payload.exp;
    const iat = payload.iat;
    const curr = Math.floor(Date.now() / 1000);
    if (curr > exp || curr < iat) return done(null, false, 'Token Expired');
    return done(null, user[0]);
  }
);

const loginStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async function (req, email, password, done) {
    const query = await UserModel.getOneByEmail(email);
    if (!query?.length) return done(null, false, 'Email not found.');
    bcrypt.compare(password, query[0].PASSWORD, (err, result) => {
      if (err) return done(null, false, err);
      if (result) return done(null, JSON.parse(JSON.stringify(query[0])));
      return done(null, false, 'Invalid password');
    });
  }
);

passport.use('login', loginStrategy);
passport.use('jwt', jwtStrategy);

module.exports = passport;
