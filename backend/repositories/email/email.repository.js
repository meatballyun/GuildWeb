const { hasher } = require('../../utils/hashCode.js');
const nodemailer = require('nodemailer');
const { signUpEmail, passwordResetEmail } = require('../../repositories/email/emailTemplate.js');
const ApplicationError = require('../../utils/error/applicationError.js');
const ConfirmationEmail = require('../../models/email/confirmationEmail.model.js');
const User = require('../../models/user/user.model.js');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASS,
  },
  socketTimeout: 60000,
});

class EmailRepository {
  async sendEmail(emailOptions) {
    transporter.sendMail(emailOptions, function (err, info) {
      if (err) throw new ApplicationError(400);
      return true;
    });
  }

  async sendSignUp(uid, email) {
    const confirmationMail = await ConfirmationEmail.getAllByUser(uid, 'SignUp');
    if (confirmationMail?.length) return next(new ApplicationError(409));
    const code = await hasher(uid + email + 'SignUp');
    await ConfirmationEmail.create(uid, 'SignUp', code);
    this.sendEmail(signUpEmail(email, uid, code));
    return 'OK';
  }

  async resendSignUp(email) {
    const [user] = await User.getOneByEmail(email);
    const hasUser = user?.ID;
    if (!hasUser) throw new ApplicationError(404);
    if (user.STATUS === 'Confirmed') throw new ApplicationError(409);
    const [getEmail] = await ConfirmationEmail.getAllByUser(user.ID, 'SignUp');
    const hasEmail = getEmail?.ID;
    if (!hasEmail) this.sendSignUp(user.ID, email);
    this.sendEmail(signUpEmail(email, user.ID, getEmail.CODE));
    return 'OK';
  }

  async sendResetPassword(email) {
    const [user] = await User.getOneByEmail(email);
    const hasUser = user?.ID;
    if (!hasUser) throw new ApplicationError(404);
    const [getEmail] = await ConfirmationEmail.getAllByUser(user.ID, 'SignUp');
    const hasEmail = getEmail?.ID;
    if (!hasEmail) throw new ApplicationError(404);
    if (getEmail.STATUS === 'Pending') throw new ApplicationError(403);
    const code = await hasher(user.ID + email + 'ForgotPassword');
    await ConfirmationEmail.create(user.ID, 'ForgotPassword', code);
    this.sendEmail(passwordResetEmail(email, user.ID, code));
    return 'OK';
  }

  async validationResetPassword({ uid, code }) {
    const [confirmationMail] = await ConfirmationEmail.getAllByUser(uid, 'ForgotPassword');
    if (confirmationMail.STATUS === 'Confirmed') throw new ApplicationError(403);
    if (new Date(confirmationMail.CREATE_TIME).valueOf() + 86400000 < new Date().valueOf())
      throw new ApplicationError(403);
    if (confirmationMail.CODE !== code) throw new ApplicationError(404);
    const result = await ConfirmationEmail.update(uid, 'Confirmed', 'ForgotPassword');
    if (result.affectedRows) return 'OK';
  }

  async validationSignUp({ uid, code }) {
    const [confirmationMail] = await ConfirmationEmail.getAllByUser(uid, 'SignUp');
    if (confirmationMail.STATUS === 'Confirmed') throw new ApplicationError(403);
    if (confirmationMail.CODE !== code) throw new ApplicationError(404);
    const result = await ConfirmationEmail.update(uid, 'Confirmed', 'SignUp');
    if (!result.affectedRows) throw new ApplicationError(400);
    const status = await User.updateStatus('Confirmed', confirmationMail.USER_ID);
    if (status.affectedRows) return 'OK';
  }
}

module.exports = EmailRepository;
