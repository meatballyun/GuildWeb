const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const connection = require('../lib/db');

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
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, function (payload, done) {
    const query ='SELECT * FROM users WHERE EMAIL = ?';
    connection.query(query, payload.email, function (err, user, fields) {
        if (err) {
            console.log(err);
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Wrong JWT Token' });
        }
        if (payload.email !== user[0].EMAIL) {
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
    connection.query('SELECT * FROM users WHERE EMAIL = ?', email, function (err, [ user ], fields) {
        if (err) { return done(err); }
        if (!user || user.length === 0) {
            return done(null, false, 'Email not found.')
        }
        else {
            if (user) {
                bcrypt.compare(password, user.PASSWORD, (err, isMatch) => {
                    if (isMatch) {
                        return done(null, JSON.parse(JSON.stringify(user)));
                    } else {
                        return done(null, false, 'Invalid password');
                    }
                });
            } else {
                return done(null, false, 'Invalid user object');
            }
        }
    });
})

passport.use('login', loginStrategy);
passport.use('jwt', jwtStrategy);

module.exports = passport;