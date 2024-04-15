const express = require("express")
const router = express.Router();
const SignupController = require('../controllers/signupControllers');
const MailController = require('../controllers/mailControllers');
const signUpController = new SignupController();
const mailUpController = new MailController();

router.post('/', signUpController.signup, mailUpController.sendSignUpMail);
router.get('/', signUpController.validation);

module.exports = router;