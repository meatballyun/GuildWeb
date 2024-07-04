import express from 'express';
import { sendSignUp, resendSignUp, sendResetPassword, validationSignUp, validationResetPassword } from '../controllers';

const router = express.Router();

// send email
router.post('/send', sendSignUp);
router.post('/resend', resendSignUp);
router.post('/reset-password', sendResetPassword);

// validation
router.get('/validation-signup', validationSignUp);
router.get('/validation-reset-password', validationResetPassword);

export default router;
