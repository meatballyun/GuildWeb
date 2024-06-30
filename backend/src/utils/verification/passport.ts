import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../../types/user/user';
import { UserModel } from '../../models/user/user.model';

passport.serializeUser(function (user, done) {
  done(null, (user as User).id);
});

passport.deserializeUser(async function (id, done) {
  const user = await UserModel.getOneById(id as number);
  if (!user) {
    console.log('Wrong deserializeUser');
    return done(null, false);
  }
  done(null, JSON.parse(JSON.stringify(user)));
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: process.env.JWT_SECRET ?? '',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async function ({ email, exp, iat }, done) {
    const user = await UserModel.getOneByEmail(email);
    if (!user) return done(null, false, { message: 'Wrong JWT Token' });
    if (email !== user.email) return done(null, false, { message: 'Wrong JWT Token' });
    const curr = Math.floor(Date.now() / 1000);
    if (curr > exp || curr < iat) return done(null, false, 'Token Expired');
    return done(null, user);
  }
);

const loginStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async function (req, email, password, done) {
    const user = await UserModel.getOneByEmail(email);
    if (!user) {
      console.log('Email not found.');
      return done(null, false);
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return done(null, false, err);
      if (result) return done(null, JSON.parse(JSON.stringify(user)));
      console.log('Invalid password');
      return done(null, false);
    });
  }
);

passport.use('login', loginStrategy);
passport.use('jwt', jwtStrategy);

export default passport;
