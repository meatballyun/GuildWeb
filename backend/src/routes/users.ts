import express from 'express';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { AuthController } from '../middleware/auth';
import { MailController } from '../controllers/email/email';
import { NotificationController } from '../controllers/notification/notification';
import { UserInfoController } from '../controllers/user/userinfo';
import { UserListController } from '../controllers/user/userList';
import { verifyToken } from '../utils/verification';

const router = express.Router();

// SignUp
router.post('/signup', awaitHandlerFactory(AuthController.signup), awaitHandlerFactory(MailController.sendSignUp));

// Login, Logout, ForgotPassword
router.post('/login', awaitHandlerFactory(AuthController.login));
router.get('/logout', awaitHandlerFactory(AuthController.logout));
router.post('/reset-password', awaitHandlerFactory(AuthController.resetPassword));

// UserInfo
router.get('/me', verifyToken, awaitHandlerFactory(UserInfoController.getUserInfo));
router.put('/me', verifyToken, awaitHandlerFactory(UserInfoController.updateUserInfo));

// Friend
router.get('/', verifyToken, awaitHandlerFactory(UserListController.getUsers));
router.get('/friends', verifyToken, awaitHandlerFactory(UserListController.getFriends));
router.post('/invitation', verifyToken, awaitHandlerFactory(UserListController.sendInvitation), awaitHandlerFactory(NotificationController.createNotification));
router.put('/friends/:uid', verifyToken, awaitHandlerFactory(UserListController.updateFriend));
router.delete('/friends/:uid', verifyToken, awaitHandlerFactory(UserListController.deleteFriend));

export default router;
