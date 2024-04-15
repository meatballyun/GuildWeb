const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const UserInfoController = require('../controllers/userinfoControllers');
const userInfoController = new UserInfoController();
const UserListController = require('../controllers/userListControllers');
const userListController = new UserListController();

router.get('/me', passport.authenticate('jwt', { session: true }), userInfoController.getUserInfoByUserId);
router.put('/me', passport.authenticate('jwt', { session: true }), userInfoController.updateUserTarget);

router.get('/', passport.authenticate('jwt', { session: true }), userListController.getUsers);
router.post('/', passport.authenticate('jwt', { session: true }), userListController.sendInvitation);

router.post('/friend', passport.authenticate('jwt', { session: true }), userListController.updateFriends);
router.get('/friend', passport.authenticate('jwt', { session: true }), userListController.getFriends);
router.delete('/friend/:id', passport.authenticate('jwt', { session: true }), userListController.deleteFriend);

module.exports = router;