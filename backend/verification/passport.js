const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const connection = require('../lib/db');
const jwtConfig = require('../config/jwt');

passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user.ID);
})

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser');
    const query = 'SELECT * FROM users WHERE ID = ?';
    connection.query(query, [id], function (err, rows) {
        if (err) {
            console.log(err);
            return done(err, null);
        }
        done(null, JSON.parse(JSON.stringify(rows[0])));
    });
})

const jwtStrategy = new JwtStrategy({
    secretOrKey: jwtConfig.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, function (payload, done) {
    const query ='SELECT * FROM users WHERE EMAIL = ?';
    connection.query(query, payload.email, function (err, user, fields) {
        if (err) {
            console.log('Wrong JWT Token');
            return done(err);
        }
        if (!user) {
            console.log('Wrong JWT Token (!user)');
            return done(null, false, { message: 'Wrong JWT Token' });
        }
        if (payload.name !== user[0].NAME) {
            console.log('Wrong JWT Token (payload.name !== user.name)');
            return done(null, false, { message: 'Wrong JWT Token' });
        }

        const exp = payload.exp
        const iat = payload.iat
        const curr = Math.floor(Date.now()/1000);
        if (curr > exp || curr < iat) {
            console.log('Token Expired');
            return done(null, false, 'Token Expired')
        }
        return done(null, user[0])
    })
})

const loginStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    console.log('============\n', email, '\n============');
    connection.query('SELECT * FROM users WHERE EMAIL = ?', email, function (err, user, fields) {
        if (err) { return done(err); }
        if (!user || user.length === 0) {
            return done(null, false, { msg: 'User not found.' })
        }
        else {
            if (user[0]) {
                bcrypt.compare(password, user[0].PASSWORD, (err, isMatch) => {
                    if (isMatch) {
                        return done(null, JSON.parse(JSON.stringify(user[0])));
                    } else {
                        return done(null, false, { msg: 'Invalid password' });
                    }
                });
            } else {
                return done(null, false, { msg: 'Invalid user object' });
            }
        }
    });
})

passport.use('login', loginStrategy);
passport.use('jwt', jwtStrategy);

module.exports = passport;