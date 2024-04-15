const express = require("express")
const router = express.Router();
const MailController = require('../controllers/mailControllers');
const mailUpController = new MailController();

router.post('/resend', mailUpController.resendSignUpMail);

module.exports = router;