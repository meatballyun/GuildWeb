const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const ConfirmationMail = require('../../models/confirmationMailModel.js');
const User = require('../../models/userModel.js');
const ApplicationError = require('../../utils/error/applicationError.js');
const { signUpEmail, passwordResetEmail } = require('./emailTemplate');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  socketTimeout: 60000
});

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
        transporter.sendMail(signUpEmail(req.body.email, query.USER_ID, query.CODE), function(err, info){
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
        const CODE = await confirmationCode(user[0].ID + req.body.email + "ForgotPassword");
        await ConfirmationMail.addConfirmationMail(user[0].ID, "ForgotPassword", CODE);
        transporter.sendMail(passwordResetEmail(req.body.email, user[0].ID, CODE), function(err, info){
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
        if(confirmationMail.STATUS === "Confirmed" || ((new Date(confirmationMail.CREATE_TIME).valueOf()+86400000) < new Date().valueOf())){
            return next(new ApplicationError(403, "The verification link has expired."));
        } else if(confirmationMail.CODE === req.query.code){
            const query = await ConfirmationMail.updateConfirmationMail(req.query.uid, "Confirmed", "ForgotPassword");
            if (query.affectedRows) return res.status(200).json( {
                success: true,
                message: "The provided confirmation code is valid and can be used for user validation.",
                data: "OK"
            });
            else return next(new ApplicationError(404, "User not found."));
        } else return next(new ApplicationError(404, "The provided confirmation code does not exist or has expired."));
    }
    catch (err){
        return next(new ApplicationError(400, err));
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