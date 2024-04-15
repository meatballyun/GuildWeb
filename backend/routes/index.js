const express = require('express');
const router = express.Router();
const signup = require('./signup.js');
const email = require('./email.js');
const user = require('./user.js');
const upload = require('./upload.js');
const food = require('./food.js');
const passport = require('../verification/passport');
const LogInController = require('../controllers/loginControllers');
const logInController = new LogInController();

const UserListController = require('../controllers/userListControllers');
const userListController = new UserListController();

//router.get('/', passport.authenticate('jwt', { session: false }) );
router.get('/checkAuth', userListController.sendInvitation);

router.post('/login', logInController.login);

router.get('/logout', logInController.logout);

router.use('/signup', signup)

router.use('/email', email)

router.use('/user', user)

router.use('/upload', upload)

router.use('/food', food)

module.exports = router;
