const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const SignupController = require('../controllers/signupControllers');
const signUpController = new SignupController();

router.get('/', async (req, res) => {
});

router.post('/api/login', function (req, res, next) {
    passport.authenticate('login', function (err, user, info) {
        if (err) return next(err)
        if (!user) {
            return res.status(401).json({ data: info });
        }
        req.login(user, function (err) {
            if (err) return next(err)
            req.session.userId = user.user_id;
            console.log('redirect');
            return res.status(200).json({ data: 'ok' });
        })
    })(req, res, next)
})

router.post('/signup', signUpController.signup);

//router.get('/find-user',);


module.exports = router;
