const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const UserInfoController = require('../controllers/userinfoControllers');
const userInfo = new UserInfoController();
const UserListController = require('../controllers/userListControllers');
const userList = new UserListController();

// UserInfo
router.get('/me', auth, userInfo.getUserInfoByUserId);

router.put('/me', auth, userInfo.updateUserTarget);

// Friend
router.get('/', auth, userList.getUsers);

router.get('/friend', auth, userList.getFriends);

router.post('/', auth, userList.sendInvitation);

router.put('/friend', auth, userList.updateFriends);

router.delete('/friend/:id', auth, userList.deleteFriend);

module.exports = router;