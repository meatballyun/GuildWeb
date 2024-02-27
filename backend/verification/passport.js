const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const connection = require('../lib/db');
const bcrypt = require('bcrypt');

passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user);
})

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser');
    const query = 'SELECT * FROM Users WHERE id = ?';
    connection.query(query, [id], function (err, rows) {
        if (err) {
            return done(err, null);
        }
        done(null, JSON.parse(JSON.stringify(rows[0])));
    });
})

const loginStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    console.log('============\n', email, password, '\n------------');
    connection.query('SELECT * FROM Users WHERE email = ?', email, function (err, user, fields) {
        if (err) { return done(err); }
        if (!user || user.length === 0) {
            return done(null, false, { msg: 'User not found.' })
        }
        else {
            if (user[0].password) {
                bcrypt.compare(password, user[0].password, (err, isMatch) => {
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

const jwtStrategy = new JwtStrategy({
    secretOrKey: jwtConfig.secret,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.versionOneCompatibility({ authScheme: 'Bearer' }),
        ExtractJwt.fromAuthHeader()
    ])
}, function (payload, done) {
    connection.query('SELECT * FROM Users WHERE email = ?', payload.email, function (err, user, fields) {
        if (err) return done(err)
        if (!user) return done(null, false, { message: 'Wrong JWT Token' })
        if (payload.name !== user.name) return done(null, false, { message: 'Wrong JWT Token' })

        const exp = payload.exp
        const iat = payload.iat
        const curr = Math.floor(Date.now() / 1000);
        if (curr > exp || curr < iat) {
            return done(null, false, 'Token Expired')
        }
        return done(null, user)
    })
})

passport.use('login', loginStrategy);
passport.use('jwt', jwtStrategy);

module.exports = passport;