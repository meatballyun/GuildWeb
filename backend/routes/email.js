const express = require("express")
const router = express.Router();
const MailController = require('../controllers/mailControllers');
const mailUp = new MailController();

router.post('/resend', mailUp.resendSignUpMail);

module.exports = router;