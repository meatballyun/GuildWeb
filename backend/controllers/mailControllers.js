const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const ConfirmationMail = require('../models/confirmationMailModel');
const User = require('../models/userModel');

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
  to: EMAIL,
  subject: 'Hello User',
  html: `
        <p>This email sincerely invites you to join Guild.</p>
        <p>Brave adventurers, please activate the magic emblem below to join our ranks.</p>
        <a href="http://192.168.1.120:3000/validation?id=${ID}&code=${CODE}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
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
  async sendSignUpMail(req, res) {
    try {
      const CODE = await confirmationCode(req.body.id + req.body.email + "SignUp");
      const query = await ConfirmationMail.addConfirmationMail(req.body.id, "SignUp", CODE);
      transporter.sendMail(mailOptions(req.body.email, query.insertId, CODE), function(err, info){
        if(err){
          console.log(err);
          return res.status(404).json({
            success: false,
            message: "Email address not found.",
            error: "Not Found"
          });
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
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "Bad Request: The email address provided is invalid.",
        data: "Bad Request"
      });
    }
  }

  async resendSignUpMail(req, res) {
    try {
      const [ user ] = await User.getUserByEmail(req.body.email);

      if(!user){
        return res.status(404).json({
          success: false,
          message: "The email address you clicked on has not been registered with any account.",
          data: "Not Found"
        });
      }
      const [ query ] = await ConfirmationMail.getConfirmationMailByUserId(user.ID);
      if(query.STATUS === "Confirmed"){
          return res.status(403).json({
              success: false,
              message: "This email address has already been verified. Your account is already activated.",
              data: "Forbidden"
        });
      } else {
        transporter.sendMail(mailOptions(req.body.email, query.ID, query.CODE), function(err, info){
          if(err){
            console.log(err);
            return res.status(404).json({
              success: false,
              message: "Email address not found.",
              error: "Not Found"
            });
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
      console.log(err);
      return res.status(400).json({
        success: false,
        message: "Bad Request: The email address provided is invalid.",
        data: "Bad Request"
      });
    }
  }

  async sendForgotPasswordMail(req, res) {
    try {
      
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Bad Request: The email address provided is invalid.",
        data: "Bad Request"
      });
    }
  }
  
    
}

module.exports = MailController;