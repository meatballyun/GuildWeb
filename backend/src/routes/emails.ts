import express from 'express'
import awaitHandlerFactory from '../utils/awaitHandlerFactory'
import EmailUp from '../controllers/email/emailControllers'

const router = express.Router();

// send email
router.post('/send', awaitHandlerFactory(EmailUp.sendSignUp));
router.post('/resend', awaitHandlerFactory(EmailUp.resendSignUp));
router.post('/reset-password', awaitHandlerFactory(EmailUp.sendResetPassword));

// validation
router.get('/validation-reset-password', awaitHandlerFactory(EmailUp.validationResetPassword));
router.get('/validation-signup', awaitHandlerFactory(EmailUp.validationSignUp));

export default router;
