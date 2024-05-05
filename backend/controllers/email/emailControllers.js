const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const ConfirmationEmail = require('../../models/confirmationEmailModel.js');
const User = require('../../models/userModel.js');
const ApplicationError = require('../../utils/error/applicationError.js');
const { signUpEmail, passwordResetEmail } = require('./emailTemplate.js');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  socketTimeout: 60000
});


// 他的名稱 confirmationCode 是名詞，用來當 function 名稱是有什麼理由？
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
      const confirmationMail = await ConfirmationEmail.getConfirmationEmailsByUserId(req.body.uid, "SignUp");
      if (confirmationMail?.length) {
        return next(new ApplicationError(409, "This email address has already been signup."));
      }

      // 你使用 UPPER_CASE 有特別含意嗎？通常來說 UPPER_CASE 的 variable 代表的意義是：Constants Variable 或是 Global Variable
      const CODE = await confirmationCode(req.body.uid + req.body.email + "SignUp");
      await ConfirmationEmail.addConfirmationEmail(req.body.uid, "SignUp", CODE);

      transporter.sendMail(signUpEmail(req.body.email, req.body.uid, CODE), function(err, info){
        if(err){
          // 建議你可以看看兩個東西，一個是 Early Return，當你寫越多 if, else 你的 procedure 越巢狀，之後越難維護，Early Return 是一個解決的方法
          // 然後你都已經定義 Custom Error 而且也有寫 Error Handler 了，有錯就直接 throw 了吧
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
      // 這邊如果有預期外的錯誤應該是 500 (Internal Error) 吧？ 而不是 400 (Bad Request)
      return next(new ApplicationError(400, err));
    }
  }

  async resendSignUp(req, res, next) {
    try {
      const user = await User.getUserByEmail(req.body.email);
      
      // 這個就是 Early Return
      if(!user?.length){
        return next(new ApplicationError(404, "The email address you clicked on has not been registered with any account."));
      }

      // 你的 prettier 是不是沒有設定好，還是你根本沒有使用 prettier，為什麼有些會是 `[ variable ]` 有些會是 `[variable]`
      const [ query ] = await ConfirmationEmail.getConfirmationEmailsByUserId(user.ID, "SignUp");
      // 那這邊為什麼又不使用 Early Return 了？
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

  // 這個當範例，我直接改一次寫法
  async sendResetPassword(req, res, next) {
    const users = await User.getUserByEmail(req.body.email);

    // Check if the current exits
    const user = users?.[0]
    if (!user) {
      throw new ApplicationError(404, "The email address you clicked on has not been registered with any account.")
    }

    // Check if the confirmation email exists
    const confirmationEmail = (await ConfirmationEmail.getConfirmationEmailsByUserId(user.ID, "SignUp"))?.[0];
    if (!confirmationEmail) {
      throw new ApplicationError(404, "The email address has not been verified.")
    }

    // Prevent the email status is pending
    if (confirmationEmail.STATUS === "Pending") {
      // 順帶問一下，這個 403 是寫錯？
      throw new ApplicationError(403, "The email address has not been verified.")
    }

    // 命名不夠好，單看下面這段 Code 我看不懂邏輯 (所以我就不調整了)
    const code = await confirmationCode(user.ID + req.body.email + "ForgotPassword");
    await ConfirmationEmail.addConfirmationEmail(user.ID, "ForgotPassword", code);

    // Send Email
    await new Promise((resolve, reject) => transporter.sendMail(passwordResetEmail(req.body.email, user.ID, code), function (err, info) {
      if (err) {
        return reject(new ApplicationError(404, "Email address not found."));
      }
      resolve(info)
    }))

    return res.status(200).json({
      success: true,
      message: "Email send successfully.",
      data: "OK"
    });
  }
    
  async validationResetPassword(req, res, next) {
    try {
        const [confirmationMail] = await ConfirmationEmail.getConfirmationEmailsByUserId(req.query.uid, "ForgotPassword");
        if(confirmationMail.STATUS === "Confirmed" || ((new Date(confirmationMail.CREATE_TIME).valueOf()+86400000) < new Date().valueOf())){
            return next(new ApplicationError(403, "The verification link has expired."));
        } else if(confirmationMail.CODE === req.query.code){
            const query = await ConfirmationEmail.updateConfirmationEmail(req.query.uid, "Confirmed", "ForgotPassword");
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
        const [confirmationMail] = await ConfirmationEmail.getConfirmationEmailsByUserId(req.query.uid, "SignUp");
        if(confirmationMail.STATUS === "Confirmed"){
          return next(new ApplicationError(403, "The verification link has expired or the account is already activated."));
        }else if(confirmationMail.CODE === req.query.code){
          const query = await ConfirmationEmail.updateConfirmationEmail(req.query.uid, "Confirmed", "SignUp");
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