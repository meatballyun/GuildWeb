const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const signUp = new (require('../controllers/user/signupControllers'))();
const login = new (require('../controllers/user/loginControllers'))();
const userInfo = new (require('../controllers/user/userinfoControllers'))();
const userList = new (require('../controllers/user/userListControllers'))();


// SignUp
router.post('/signup', signUp.signup);

// Login、Logout
router.post('/login', login.login);

router.get('/logout', login.logout);


// UserInfo
router.get('/me', auth, userInfo.getUserInfoByUserId);

router.put('/me', auth, userInfo.updateUserInfo);

// ForgotPassword
router.post('/reset-password', userInfo.resetPassword);

// Friend
router.get('/', auth, userList.getUsers);

router.get('/friends', auth, userList.getFriends);

router.post('/invitation', auth, userList.sendInvitation);

router.put('/friends/:uid', auth, userList.updateFriend);

router.delete('/friends/:uid', auth, userList.deleteFriend);

module.exports = router;