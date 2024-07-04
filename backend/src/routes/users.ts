import express from 'express';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { signup, login, logout, resetPassword } from '../middleware/auth';
import { sendSignUp } from '../controllers';
import { createNotification } from '../controllers';
import { getUserInfo, updateUserInfo, getUsers, getFriends, sendFriendInvitation, updateFriend, deleteFriend } from '../controllers';
import { verifyToken } from '../utils/verification';

const router = express.Router();

// SignUp
router.post('/signup', signup, sendSignUp);

// Login, Logout, ForgotPassword
router.post('/login', login);
router.get('/logout', logout);
router.post('/reset-password', resetPassword);

// UserInfo
router.get('/me', verifyToken, getUserInfo);
router.put('/me', verifyToken, updateUserInfo);

// Friend
router.get('/', verifyToken, getUsers);
router.get('/friends', verifyToken, getFriends);
router.post('/invitation', verifyToken, sendFriendInvitation, createNotification);
router.put('/friends/:uid', verifyToken, updateFriend);
router.delete('/friends/:uid', verifyToken, deleteFriend);

export default router;
