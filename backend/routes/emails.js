const express = require('express');
const router = express.Router();
const awaitHandlerFactory = require('../utils/awaitHandlerFactory');
const emailUp = require('../controllers/email/emailControllers');

// send email
router.post('/send', awaitHandlerFactory(emailUp.sendSignUp));
router.post('/resend', awaitHandlerFactory(emailUp.resendSignUp));
router.post('/reset-password', awaitHandlerFactory(emailUp.sendResetPassword));

// validation
router.get('/validation-reset-password', awaitHandlerFactory(emailUp.validationResetPassword));
router.get('/validation-signup', awaitHandlerFactory(emailUp.validationSignUp));

module.exports = router;
