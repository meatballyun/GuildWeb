const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const ConfirmationMail = require('../../models/confirmationMailModel.js');
const User = require('../../models/userModel.js');
const ApplicationError = require('../../utils/error/applicationError.js');
VALIDATION_URL = process.env.NODE_ENV === 'development' ? process.env.FE_URL : process.env.API_SERVICE_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  socketTimeout: 60000
});

const mailOptions = (EMAIL, ID, CODE) => ({
  from: process.env.MAIL_USER,
  to: "rex.rex022534@gmail.com",
  subject: 'Hello User',
  html: `
        <p>This email sincerely invites you to join Guild.</p>
        <p>Brave adventurers, please activate the magic emblem below to join our ranks.</p>
        <a href="${VALIDATION_URL}/validation?id=${ID}&code=${CODE}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>(If you did not request this verification, please ignore this email.)</p>
    `
})

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
  async sendSignUpEmail(req, res, next) {
    try {
      const confirmationMail = await ConfirmationMail.getConfirmationMailByUserId(req.body.uid);
      if (confirmationMail?.length) {
        return next(new ApplicationError(409, "This email address has already been signup."));
      }
      const CODE = await confirmationCode(req.body.uid + req.body.email + "SignUp");
      const query = await ConfirmationMail.addConfirmationMail(req.body.uid, "SignUp", CODE);
      transporter.sendMail(mailOptions(req.body.email, req.body.uid, CODE), function(err, info){
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
      return next(new ApplicationError(400));
    }
  }

  async resendSignUpEmail(req, res, next) {
    try {
      const user = await User.getUserByEmail(req.body.email);
      if(!user?.length){
        return next(new ApplicationError(404, "The email address you clicked on has not been registered with any account."));
      }
      const [ query ] = await ConfirmationMail.getConfirmationMailByUserId(user[0].ID);
      if (!query || query?.length) {
        req.body.uid = user[0].ID;
        next();
      } else if(query.STATUS === "Confirmed"){
        return next(new ApplicationError(403, "This email address has already been verified. Your account is already activated."));
      } else {
        transporter.sendMail(mailOptions(req.body.email, query.ID, query.CODE), function(err, info){
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

  async sendForgotPassword(req, res) {
    try {
      
    } catch (err) {
      return next(new ApplicationError(400));
    }
  }
  
    
}

module.exports = MailController;