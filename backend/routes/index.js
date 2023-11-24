const express = require('express');
const router = express.Router();
const passport = require('passport');
const SignupController = require('../controllers/signupControllers');
const signUpController = new SignupController();

router.get('/', async (req, res) => {
});

router.post('/login', passport.authenticate('local', { failureRedirect: 'http://localhost:3000/login' }),
    function (req, res) {
        res.redirect('http://localhost:3000/');
        console.log('redirect');
    }
);

router.post('/signup', signUpController.signup);

module.exports = router;
