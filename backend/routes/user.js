const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const UserInfoController = require('../controllers/userinfoControllers');
const userInfoController = new UserInfoController();
const UserListController = require('../controllers/userListControllers');
const userListController = new UserListController();

router.get('/me', passport.authenticate('jwt', { session: true }), userInfoController.getUserInfoByUserId);
router.put('/me', passport.authenticate('jwt', { session: true }), userInfoController.updateUserTarget);

router.put('/name', passport.authenticate('jwt', { session: true }), userListController.updateUserTarget);

module.exports = router;