const express = require("express")
const router = express.Router();
const mailUp = new (require('../controllers/mailControllers'))();

router.post('/resend', mailUp.resendSignUpMail);

module.exports = router;