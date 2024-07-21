import express from 'express';
import { sendSignUp, resendSignUp, sendResetPassword, validationSignUp, validationResetPassword } from '../controllers';

const router = express.Router();

// send email
// Sending a registration verification email
router.post('/send', sendSignUp);
//Resend the registration verification email
router.post('/resend', resendSignUp);
// Send the password reset email
router.post('/reset-password', sendResetPassword);

// validation
// Verify the registration action
router.get('/validation-signup', validationSignUp);
// Verify the reset password action
router.get('/validation-reset-password', validationResetPassword);

export default router;
