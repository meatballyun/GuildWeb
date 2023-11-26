const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../lib/db');
const bcrypt = require('bcrypt');


let loginStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true, // 讓 varify callback 函式可以取得 req 物件
},
    function (req, email, password, done) {
        console.log('============\n', email, password, '\n------------');
        connection.query('SELECT * FROM user WHERE email = ?', email, function (err, user, fields) {
            //console.log(user);
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
    }
)

// 從 strategy 得到輸入值 user，可設定將哪些 user 資訊，儲存在 Session 中的 req.session.passport.user
passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user.user_id);
})

// 輸入 user (req.session.passport.user) 值，從 session 中取得該資料，儲存在 req.user
passport.deserializeUser(function (id, done) {
    console.log('deserializeUser');
    const query = 'SELECT * FROM user WHERE id = ?';
    connection.query(query, [id], function (err, rows) {
        if (err) {
            return done(err, null);
        }
        done(null, JSON.parse(JSON.stringify(rows[0])));
    });
})

passport.use('login', loginStrategy);

module.exports = passport;