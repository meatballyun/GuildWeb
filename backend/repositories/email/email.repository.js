const { toHash } = require('../../utils/hashCode.js');
const nodemailer = require('nodemailer');
const { signUpEmail, passwordResetEmail } = require('../../repositories/email/emailTemplate.js');
const ApplicationError = require('../../utils/error/applicationError.js');
const ConfirmationEmail = require('../../models/email/confirmationEmail.model.js');
const User = require('../../models/user/user.model.js');

class EmailRepository {
  static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASS,
    },
    socketTimeout: 60000,
  });

  static async sendEmail(emailOptions) {
    this.transporter.sendMail(emailOptions, function (err, info) {
      if (err) throw new ApplicationError(400);
    });
  }

  static async sendSignUp({ uid, email }) {
    const confirmationMail = await ConfirmationEmail.getLatestByUser(uid, 'SignUp');
    const hasConfirmationMail = confirmationMail?.length;
    if (hasConfirmationMail) throw new ApplicationError(409);

    const code = await toHash(uid + email + 'SignUp');
    await ConfirmationEmail.create(uid, 'SignUp', code);

    this.sendEmail(signUpEmail(email, uid, code));
  }

  static async resendSignUp(email) {
    const user = await User.getOneByEmail(email);
    if (!user) throw new ApplicationError(404);
    if (user.STATUS === 'Confirmed') throw new ApplicationError(409);
    const latestEmail = await ConfirmationEmail.getLatestByUser(user.ID, 'SignUp');
    if (!latestEmail) this.sendSignUp(user.ID, email);
    this.sendEmail(signUpEmail(email, user.ID, latestEmail.CODE));
  }

  static async sendResetPassword(email) {
    const user = await User.getOneByEmail(email);
    if (!user) throw new ApplicationError(404);
    const latestEmail = await ConfirmationEmail.getLatestByUser(user.ID, 'SignUp');
    if (!latestEmail) throw new ApplicationError(404);
    if (latestEmail.STATUS === 'Pending') throw new ApplicationError(403);
    const code = await toHash(user.ID + email + 'ForgotPassword');
    await ConfirmationEmail.create(user.ID, 'ForgotPassword', code);
    this.sendEmail(passwordResetEmail(email, user.ID, code));
  }

  static async validationResetPassword({ uid, code }) {
    const latestEmail = await ConfirmationEmail.getLatestByUser(uid, 'ForgotPassword');
    if (latestEmail.STATUS === 'Confirmed') throw new ApplicationError(403);

    if (new Date(latestEmail.CREATE_TIME).valueOf() + 86400000 < new Date().valueOf())
      throw new ApplicationError(403);
    if (latestEmail.CODE !== code) throw new ApplicationError(404);

    await ConfirmationEmail.update(uid, 'Confirmed', 'ForgotPassword');
  }

  static async validationSignUp({ uid, code }) {
    const latestEmail = await ConfirmationEmail.getLatestByUser(uid, 'SignUp');
    if (latestEmail.STATUS === 'Confirmed') throw new ApplicationError(403);
    if (latestEmail.CODE !== code) throw new ApplicationError(404);

    await ConfirmationEmail.update(uid, 'Confirmed', 'SignUp');
    await User.updateStatus('Confirmed', latestEmail.USER_ID);
  }
}

module.exports = EmailRepository;