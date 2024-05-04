const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/userModel.js');
const ApplicationError = require('../utils/error/applicationError.js');

passport.serializeUser(function (user, done) {
  console.log('serializeUser');
  done(null, user.ID);
});

passport.deserializeUser(async function (id, done) {
  console.log('deserializeUser');
  const query = await UserModel.getUserById(id);
  if (query?.length) {
    return done(null, false, { message: 'Wrong deserializeUser' });
  }
  done(null, JSON.parse(JSON.stringify(query[0])));
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async function (payload, done) {
    const query = await UserModel.getUserByEmail(payload.email);
    if (!query || query.length === 0) {
      return done(null, false, { message: 'Wrong JWT Token' });
    } else if (payload.email !== query[0].EMAIL) {
      return done(null, false, { message: 'Wrong JWT Token' });
    } else {
      const exp = payload.exp;
      const iat = payload.iat;
      const curr = Math.floor(Date.now() / 1000);
      if (curr > exp || curr < iat) {
        return done(null, false, 'Token Expired');
      }
      return done(null, query[0]);
    }
  }
);

const loginStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async function (req, email, password, done) {
    const query = await UserModel.getUserByEmail(email);
    if (!query || query.length === 0) {
      return done(null, false, 'Email not found.');
    } else {
      if (query[0]) {
        bcrypt.compare(password, query[0].PASSWORD, (err, result) => {
          if (err) {
            return done(null, false, err);
          } else if (result) {
            return done(null, JSON.parse(JSON.stringify(query[0])));
          } else {
            return done(null, false, 'Invalid password');
          }
        });
      } else {
        return done(null, false, 'Invalid user object');
      }
    }
  }
);

passport.use('login', loginStrategy);
passport.use('jwt', jwtStrategy);

module.exports = passport;
