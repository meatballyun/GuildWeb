const express = require("express")
const router = express.Router();
const mailUp = new (require('../controllers/email/mailControllers'))();

router.post('/send', mailUp.sendSignUpEmail);

router.post('/resend', mailUp.resendSignUpEmail, mailUp.sendSignUpEmail);

router.post('/forgot', mailUp.sendForgotPassword);

module.exports = router;