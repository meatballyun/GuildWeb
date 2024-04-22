const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const signUp = new (require('../controllers/user/signupControllers'))();
const login = new (require('../controllers/user/loginControllers'))();
const userInfo = new (require('../controllers/user/userinfoControllers'))();
const userList = new (require('../controllers/user/userListControllers'))();


// signUp
router.post('/signup', signUp.signup);

router.get('/signUp', signUp.validation);

// login、logout
router.post('/login', login.login);

router.get('/logout', login.logout);

// UserInfo
router.get('/me', auth, userInfo.getUserInfoByUserId);

router.put('/me', auth, userInfo.updateUserInfo);

// Friend
router.get('/', auth, userList.getUsers);

router.get('/friend', auth, userList.getFriends);

router.post('/invitation', auth, userList.sendInvitation);

router.put('/friend', auth, userList.updateFriends);

router.delete('/friend/:id', auth, userList.deleteFriend);

module.exports = router;