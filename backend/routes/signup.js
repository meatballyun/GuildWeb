const express = require("express")
const router = express.Router();
const SignupController = require('../controllers/signupControllers');
const MailController = require('../controllers/mailControllers');
const signUp = new SignupController();
const mailUp = new MailController();

router.post('/', signUp.signup, mailUp.sendSignUpMail);
router.get('/', signUp.validation);

module.exports = router;