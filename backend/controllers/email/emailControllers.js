const { hasher } = require('../../utils/hashCode.js');
const nodemailer = require('nodemailer');
const { signUpEmail, passwordResetEmail } = require('./emailTemplate.js');
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

class MailController {
  async sendSignUp(req, res, next) {
    const confirmationMail = await ConfirmationEmail.getAllByUser(req.body.uid, 'SignUp');
    if (confirmationMail?.length) return next(new ApplicationError(409));

    const code = await hasher(req.body.uid + req.body.email + 'SignUp');
    await ConfirmationEmail.create(req.body.uid, 'SignUp', code);

    transporter.sendMail(signUpEmail(req.body.email, req.body.uid, code), function (err, info) {
      if (err) return next(new ApplicationError(404));
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ data: 'OK' });
    });
  }

  async resendSignUp(req, res, next) {
    const user = await User.getOneByEmail(req.body.email);
    if (!user?.length) return next(new ApplicationError(404));

    const [query] = await ConfirmationEmail.getAllByUser(user[0].ID, 'SignUp');
    if (!query || query?.length) {
      req.body.uid = user[0].ID;
      return next();
    }
    if (query.STATUS === 'Confirmed') return next(new ApplicationError(403));
    transporter.sendMail(
      signUpEmail(req.body.email, query.USER_ID, query.CODE),
      function (err, info) {
        if (err) return next(new ApplicationError(404));

        console.log('Email sent: ' + info.response);
        return res.status(200).json({ data: 'OK' });
      }
    );
  }

  async sendResetPassword(req, res, next) {
    const user = await User.getOneByEmail(req.body.email);
    if (!user?.length) return next(new ApplicationError(404));

    const [query] = await ConfirmationEmail.getAllByUser(user[0].ID, 'SignUp');
    if (!query || query?.length) return next(new ApplicationError(404));

    if (query.STATUS === 'Pending') return next(new ApplicationError(403));

    const code = await hasher(user[0].ID + req.body.email + 'ForgotPassword');
    await ConfirmationEmail.create(user[0].ID, 'ForgotPassword', code);
    transporter.sendMail(
      passwordResetEmail(req.body.email, user[0].ID, code),
      function (err, info) {
        if (err) return next(new ApplicationError(404));

        console.log('Email sent: ' + info.response);
        return res.status(200).json({ data: 'OK' });
      }
    );
  }

  async validationResetPassword(req, res, next) {
    const [confirmationMail] = await ConfirmationEmail.getAllByUser(
      req.query.uid,
      'ForgotPassword'
    );
    if (
      confirmationMail.STATUS === 'Confirmed' ||
      new Date(confirmationMail.CREATE_TIME).valueOf() + 86400000 < new Date().valueOf()
    )
      return next(new ApplicationError(403));
    if (confirmationMail.CODE === req.query.code) {
      const query = await ConfirmationEmail.update(req.query.uid, 'Confirmed', 'ForgotPassword');
      if (query.affectedRows) return res.status(200).json({ data: 'OK' });
    }
    return next(new ApplicationError(404));
  }

  async validationSignUp(req, res, next) {
    const [confirmationMail] = await ConfirmationEmail.getAllByUser(req.query.uid, 'SignUp');
    if (confirmationMail.STATUS === 'Confirmed') return next(new ApplicationError(403));
    if (confirmationMail.CODE === req.query.code) {
      const query = await ConfirmationEmail.update(req.query.uid, 'Confirmed', 'SignUp');
      if (query.affectedRows) {
        const rows = await User.updateStatus('Confirmed', confirmationMail.USER_ID);
        if (rows.affectedRows) return res.status(200).json({ data: 'OK' });
      }
    }
    return next(new ApplicationError(404));
  }
}

module.exports = MailController;
