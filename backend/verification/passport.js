const LocalStrategy = require('passport-local').Strategy;
const connection = require('../lib/db');
const bcrypt = require('bcrypt');

module.exports = passport => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true, // 讓 varify callback 函式可以取得 req 物件
    },
        function (req, email, password, done) {
            console.log('============\n', email, password);
            connection.query('SELECT * FROM user WHERE email = ?', email, function (err, user, fields) {
                console.log(user);
                if (err) { return done(err) }
                if (!user) { return done(null, false, req.flash('info', 'User not found.')) }
                bcrypt.compare(password, user[0].password, (err, isMatch) => {
                    if (isMatch) { return done(null, user) }
                    return done(null, false, req.flash('info', 'Invalid password'))
                })
            });
        }
    ))

    // 從 strategy 得到輸入值 user，可設定將哪些 user 資訊，儲存在 Session 中的 req.session.passport.user
    passport.serializeUser(function (user, done) {
        done(null, user[0].user_id);
    })

    // 輸入 user (req.session.passport.user) 值，從 session 中取得該資料，儲存在 req.user
    passport.deserializeUser(function (id, done) {
        const query = 'SELECT * FROM user WHERE id = ?';
        connection.query(query, [id], function (err, rows) {
            if (err) {
                return done(err, null);
            }
            const user = rows[0];
            done(null, user);
        });
    })
}