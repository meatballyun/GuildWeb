import express from 'express';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { MailController } from '../controllers/email/email';

const router = express.Router();

// send email
router.post('/send', awaitHandlerFactory(MailController.sendSignUp));
router.post('/resend', awaitHandlerFactory(MailController.resendSignUp));
router.post('/reset-password', awaitHandlerFactory(MailController.sendResetPassword));

// validation
router.get('/validation-reset-password', awaitHandlerFactory(MailController.validationResetPassword));
router.get('/validation-signup', awaitHandlerFactory(MailController.validationSignUp));

export default router;
