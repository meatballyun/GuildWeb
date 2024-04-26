const express = require("express")
const router = express.Router();
const mailUp = new (require('../controllers/email/mailControllers'))();

router.post('/send', mailUp.sendSignUp);

router.post('/resend', mailUp.resendSignUp, mailUp.sendSignUp);

router.post('/reset-password', mailUp.sendResetPassword);

router.get('/validation-reset-password', mailUp.validationResetPassword);

router.get('/validation-signup', mailUp.validationSignUp);

module.exports = router;