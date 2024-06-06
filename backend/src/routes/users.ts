import express from 'express';
import awaitHandlerFactory from '../utils/awaitHandlerFactory';
import passport from '../utils/verification/passport';
import authController from '../controllers/user/authControllers';
import emailUp from '../controllers/email/emailControllers';
import notification from '../controllers/notification/notificationControllers';
import userInfo from '../controllers/user/userinfoControllers';
import userList from '../controllers/user/userListControllers';

const auth = passport.authenticate('jwt', { session: true });
const router = express.Router();

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

export default router;
