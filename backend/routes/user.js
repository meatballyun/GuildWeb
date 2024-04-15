const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const UserInfoController = require('../controllers/userinfoControllers');
const userInfoController = new UserInfoController();


router.get('/me', passport.authenticate('jwt', { session: true }), userInfoController.getUserInfoByUserId);
router.put('/me', passport.authenticate('jwt', { session: true }), userInfoController.updateUserTarget);

module.exports = router;