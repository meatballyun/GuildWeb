import express from 'express';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import passport from '../utils/verification/passport';
import { AuthController } from '../controllers/user/authControllers';
import { MailController } from '../controllers/email/emailControllers';
import { NotificationController } from '../controllers/notification/notificationControllers';
import { UserInfoController } from '../controllers/user/userinfoControllers';
import { UserListController } from '../controllers/user/userListControllers';

const auth = passport.authenticate('jwt', { session: true });
const router = express.Router();

// SignUp
router.post('/signup', awaitHandlerFactory(AuthController.signup), awaitHandlerFactory(MailController.sendSignUp));

// Login, Logout, ForgotPassword
router.post('/login', awaitHandlerFactory(AuthController.login));
router.get('/logout', awaitHandlerFactory(AuthController.logout));
router.post('/reset-password', awaitHandlerFactory(AuthController.resetPassword));

// UserInfo
router.get('/me', auth, awaitHandlerFactory(UserInfoController.getUserInfo));
router.put('/me', auth, awaitHandlerFactory(UserInfoController.updateUserInfo));

// Friend
router.get('/', auth, awaitHandlerFactory(UserListController.getUsers));
router.get('/friends', auth, awaitHandlerFactory(UserListController.getFriends));
router.post('/invitation', auth, awaitHandlerFactory(UserListController.sendInvitation), awaitHandlerFactory(NotificationController.createNotification));
router.put('/friends/:uid', auth, awaitHandlerFactory(UserListController.updateFriend));
router.delete('/friends/:uid', auth, awaitHandlerFactory(UserListController.deleteFriend));

export default router;
