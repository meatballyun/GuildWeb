const express = require('express');
const awaitHandlerFactory = require('../utils/awaitHandlerFactory');
const passport = require('../utils/verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const router = express.Router();

const authController = require('../controllers/user/authControllers');
const emailUp = require('../controllers/email/emailControllers');
const notification = require('../controllers/notification/notificationControllers');
const userInfo = require('../controllers/user/userinfoControllers');
const userList = require('../controllers/user/userListControllers');

// SignUp
router.post('/signup', awaitHandlerFactory(authController.signup), awaitHandlerFactory(emailUp.sendSignUp));

// Login, Logout, ForgotPassword
router.post('/login', awaitHandlerFactory(authController.login));
router.get('/logout', awaitHandlerFactory(authController.logout));
router.post('/reset-password', awaitHandlerFactory(authController.resetPassword));

// UserInfo
router.get('/me', auth, awaitHandlerFactory(userInfo.getUserInfo));
router.put('/me', auth, awaitHandlerFactory(userInfo.updateUserInfo));

// Friend
router.get('/', auth, awaitHandlerFactory(userList.getUsers));
router.get('/friends', auth, awaitHandlerFactory(userList.getFriends));
router.post('/invitation', auth, awaitHandlerFactory(userList.sendInvitation), awaitHandlerFactory(notification.createNotification));
router.put('/friends/:uid', auth, awaitHandlerFactory(userList.updateFriend));
router.delete('/friends/:uid', auth, awaitHandlerFactory(userList.deleteFriend));

module.exports = router;
