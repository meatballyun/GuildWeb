import express from 'express';
import { sendSignUp } from '../controllers';
import { createNotification } from '../controllers';
import { signup, login, resetPassword, getUserInfo, updateUserInfo, getUsers, getFriends, sendFriendInvitation, updateFriend, deleteFriend } from '../controllers';
import { verifyToken } from '../utils/verification';

const router = express.Router();

// SignUp
router.post('/signup', signup, sendSignUp);

// Login, Logout, ForgotPassword
router.post('/login', login);

// UserInfo
router.get('/me', verifyToken, getUserInfo);
router.put('/me', verifyToken, updateUserInfo);
router.post('/reset-password', verifyToken, resetPassword);

// Friend
router.get('/', verifyToken, getUsers);
router.get('/friends', verifyToken, getFriends);
router.post('/invitation', verifyToken, sendFriendInvitation, createNotification);
router.put('/friends/:uid', verifyToken, updateFriend);
router.delete('/friends/:uid', verifyToken, deleteFriend);

export default router;
