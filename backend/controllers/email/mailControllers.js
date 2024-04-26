const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const ConfirmationMail = require('../../models/confirmationMailModel.js');
const User = require('../../models/userModel.js');
const ApplicationError = require('../../utils/error/applicationError.js');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  socketTimeout: 60000
});

const signUpEmail = (EMAIL, ID, CODE) => {{
  const ADDRESS = process.env.NODE_ENV === 'development' ? process.env.TEST_MAIL : EMAIL;
  const VALIDATION_URL = process.env.NODE_ENV === 'development' ? process.env.FE_URL : process.env.API_SERVICE_URL;

  return {
  from: process.env.MAIL_USER,
  to: ADDRESS,
  subject: 'Hello User',
  html: `
        <p>This email sincerely invites you to join Guild.</p>
        <p>Brave adventurers, please activate the magic emblem below to join our ranks.</p>
        <a href="${VALIDATION_URL}/validation?id=${ID}&code=${CODE}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>(If you did not request this verification, please ignore this email.)</p>
    `
  }
}}

const passwordResetEmail = (EMAIL, ID, CODE) => {{
  const ADDRESS = process.env.NODE_ENV === 'development' ? process.env.TEST_MAIL : EMAIL;
  const VALIDATION_URL = process.env.NODE_ENV === 'development' ? process.env.FE_URL : process.env.API_SERVICE_URL;

  return {
  from: process.env.MAIL_USER,
  to: ADDRESS,
  subject: 'Password Reset Request',
  html: `
    <p>Hello,</p>
    <p>We received a request to reset the password associated with this email address. If you did not make this request, you can safely ignore this email.</p>
    <p>To reset your password, please click on the link below:</p>
    <a href="${VALIDATION_URL}/password-reset?id=${ID}&code=${CODE}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If the above link doesn't work, you can copy and paste the following URL into your web browser:</p>
    <p>${VALIDATION_URL}/password-reset?id=${ID}&code=${CODE}</p>
    <p>This link will expire in 24 hours for security reasons.</p>
    <p>Thank you,</p>
    <p>The Guild Team</p>
    `
  }
}}

const confirmationCode = (code) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(code, 10, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

class MailController {
  async sendSignUp(req, res, next) {
    try {
      const confirmationMail = await ConfirmationMail.getConfirmationMailByUserId(req.body.uid, "SignUp");
      if (confirmationMail?.length) {
        return next(new ApplicationError(409, "This email address has already been signup."));
      }
      const CODE = await confirmationCode(req.body.uid + req.body.email + "SignUp");
      await ConfirmationMail.addConfirmationMail(req.body.uid, "SignUp", CODE);
      transporter.sendMail(signUpEmail(req.body.email, req.body.uid, CODE), function(err, info){
        if(err){
          return next(new ApplicationError(404, 'Email address not found.'));
        } else{
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            success: true,
            message: "Email send successfully.",
            data: "OK"
          });
        }
      })
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async resendSignUp(req, res, next) {
    try {
      const user = await User.getUserByEmail(req.body.email);
      if(!user?.length){
        return next(new ApplicationError(404, "The email address you clicked on has not been registered with any account."));
      }
      const [ query ] = await ConfirmationMail.getConfirmationMailByUserId(user[0].ID, "SignUp");
      if (!query || query?.length) {
        req.body.uid = user[0].ID;
        next();
      } else if(query.STATUS === "Confirmed"){
        return next(new ApplicationError(403, "This email address has already been verified. Your account is already activated."));
      } else {
        transporter.sendMail(signUpEmail(req.body.email, query.ID, query.CODE), function(err, info){
          if(err){
            return next(new ApplicationError(404, "Email address not found."));
          } else{
            console.log("Email sent: " + info.response);
            return res.status(200).json({
              success: true,
              message: "Email send successfully.",
              data: "OK"
            });
          }
        })
      }
    } catch (err) {
      return next(new ApplicationError(400, "Bad Request: The email address provided is invalid."));
    }
  }

  async sendResetPassword(req, res, next) {
    try {
      const user = await User.getUserByEmail(req.body.email);
      if(!user?.length){
        return next(new ApplicationError(404, "The email address you clicked on has not been registered with any account."));
      }
      const [ query ] = await ConfirmationMail.getConfirmationMailByUserId(user[0].ID, "SignUp");
      if (!query || query?.length) {
        return next(new ApplicationError(404, "The email address has not been verified."));
      } else if(query.STATUS === "Pending"){
        return next(new ApplicationError(403, "The email address has not been verified."));
      } else {
        const CODE = await confirmationCode(req.body.uid + req.body.email + "ForgotPassword");
        await ConfirmationMail.addConfirmationMail(req.body.uid, "ForgotPassword", CODE);
        transporter.sendMail(passwordResetEmail(req.body.email, query.ID, query.CODE), function(err, info){
          if(err){
            return next(new ApplicationError(404, "Email address not found."));
          } else{
            console.log("Email sent: " + info.response);
            return res.status(200).json({
              success: true,
              message: "Email send successfully.",
              data: "OK"
            });
          }
        })
      }
      
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }
    
  async validationResetPassword(req, res, next) {
    try {
        const [confirmationMail] = await ConfirmationMail.getConfirmationMailByUserId(req.query.uid, "ForgotPassword");
        if(confirmationMail.STATUS === "Confirmed" || (new Date(confirmationMail.CREATE_TIME)+86400000) < new Date() ){
            return next(new ApplicationError(403, "The verification link has expired."));
        } else if(confirmationMail.CODE === req.query.code){
            const query = await ConfirmationMail.updateConfirmationMail(req.query.uid, "Confirmed", "ForgotPassword");
            if(query.affectedRows){
                if (rows.affectedRows) return res.status(200).json( {
                    success: true,
                    message: "The provided confirmation code is valid and can be used for user validation.",
                    data: "OK"
                });
                else return next(new ApplicationError(404, "User not found."));
            } 
        } else return next(new ApplicationError(404, "The provided confirmation code does not exist or has expired."));
    }
    catch (err){
        return next(new ApplicationError(400));
    }
}
  
  async validationSignUp(req, res, next) {
    try {
        const [confirmationMail] = await ConfirmationMail.getConfirmationMailByUserId(req.query.uid, "SignUp");
        if(confirmationMail.STATUS === "Confirmed"){
            return next(new ApplicationError(403, "The verification link has expired or the account is already activated."));
        }else if(confirmationMail.CODE === req.query.code){
            const query = await ConfirmationMail.updateConfirmationMail(req.query.uid, "Confirmed", "SignUp");
            if(query.affectedRows){
                const rows = await User.updateUserStatus("Confirmed", confirmationMail.USER_ID);
                if (rows.affectedRows) return res.status(200).json( {
                    success: true,
                    message: "The provided confirmation code is valid and can be used for user validation.",
                    data: "OK"
                });
                else return next(new ApplicationError(404, "User not found."));
            } 
        } else return next(new ApplicationError(404, "The provided confirmation code does not exist or has expired."));
    }
    catch (err){
        return next(new ApplicationError(400, "Not registered yet."));
    }
  } 
    
}

module.exports = MailController;