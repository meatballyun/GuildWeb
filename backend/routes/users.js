const express = require('express');
const awaitHandlerFactory = require('../utils/awaitHandlerFactory');
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const router = express.Router();

const authController = new (require('../controllers/user/authControllers'))();
const emailUp = new (require('../controllers/email/emailControllers'))();
const notification = new (require('../controllers/notification/notificationControllers'))();
const userInfo = new (require('../controllers/user/userinfoControllers'))();
const userList = new (require('../controllers/user/userListControllers'))();

// SignUp
router.post('/signup', awaitHandlerFactory(authController.signup), awaitHandlerFactory(emailUp.sendSignUp));

// Login、Logout
router.post('/login', awaitHandlerFactory(authController.login));
router.get('/logout', awaitHandlerFactory(authController.logout));

// UserInfo
router.get('/me', auth, awaitHandlerFactory(userInfo.getUserInfo));
router.put('/me', auth, awaitHandlerFactory(userInfo.updateUserInfo));

// ForgotPassword
router.post('/reset-password', awaitHandlerFactory(userInfo.resetPassword));

// Friend
router.get('/', auth, awaitHandlerFactory(userList.getUsers));
router.get('/friends', auth, awaitHandlerFactory(userList.getFriends));
router.post('/invitation', auth, awaitHandlerFactory(userList.sendInvitation), awaitHandlerFactory(notification.createNotification));
router.put('/friends/:uid', auth, awaitHandlerFactory(userList.updateFriend));
router.delete('/friends/:uid', auth, awaitHandlerFactory(userList.deleteFriend));

module.exports = router;
