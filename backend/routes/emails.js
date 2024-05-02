const express = require("express")
const router = express.Router();
const emailUp = new (require('../controllers/email/emailControllers'))();

router.post('/send', emailUp.sendSignUp);

router.post('/resend', emailUp.resendSignUp, emailUp.sendSignUp);

router.post('/reset-password', emailUp.sendResetPassword);

router.get('/validation-reset-password', emailUp.validationResetPassword);

router.get('/validation-signup', emailUp.validationSignUp);

module.exports = router;