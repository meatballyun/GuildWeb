// @ts-nocheck
import { toHash } from '../../utils/hashCode';
import nodemailer from 'nodemailer';
import { signUpEmail, passwordResetEmail } from './emailTemplate';
import { ApplicationError } from '../../utils/error/applicationError';
import { ConfirmationEmailModel } from '../../models/email/confirmationEmail.model';
import { UserModel } from '../../models/user/user.model';

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
    const confirmationMail = await ConfirmationEmailModel.getLatestByUser(uid, 'signUp');

    const hasConfirmationMail = confirmationMail?.length;
    if (hasConfirmationMail) throw new ApplicationError(409);

    const code = await toHash(uid + email + 'signUp');
    await ConfirmationEmailModel.create(uid, 'signUp', code);

    this.sendEmail(signUpEmail(email, uid, code));
  }

  static async resendSignUp(email) {
    const user = await UserModel.getOneByEmail(email);
    if (!user) throw new ApplicationError(404);
    if (user.status === 'confirmed') throw new ApplicationError(409);

    const latestEmail = await ConfirmationEmailModel.getLatestByUser(user.id, 'signUp');
    if (!latestEmail) this.sendSignUp(user.id, email);

    this.sendEmail(signUpEmail(email, user.id, latestEmail.code));
  }

  static async sendResetPassword(email) {
    const user = await UserModel.getOneByEmail(email);
    if (!user) throw new ApplicationError(404);
    const latestEmail = await ConfirmationEmailModel.getLatestByUser(user.id, 'signUp');
    if (!latestEmail) throw new ApplicationError(404);
    if (latestEmail.status === 'pending') throw new ApplicationError(403);

    const code = await toHash(user.id + email + 'forgotPassword');
    await ConfirmationEmailModel.create(user.id, 'forgotPassword', code);
    this.sendEmail(passwordResetEmail(email, user.id, code));
  }

  static async validationResetPassword({ uid, code }) {
    const latestEmail = await ConfirmationEmailModel.getLatestByUser(uid, 'forgotPassword');
    if (latestEmail.status === 'confirmed') throw new ApplicationError(403);

    if (new Date(latestEmail.createTime).valueOf() + 86400000 < new Date().valueOf()) throw new ApplicationError(403);
    if (latestEmail.code !== code) throw new ApplicationError(404);

    await ConfirmationEmailModel.update(uid, 'confirmed', 'forgotPassword');
  }

  static async validationSignUp({ uid, code }) {
    const latestEmail = await ConfirmationEmailModel.getLatestByUser(uid, 'signUp');
    if (latestEmail.status === 'confirmed') throw new ApplicationError(403);
    if (latestEmail.code !== code) throw new ApplicationError(404);

    await ConfirmationEmailModel.update(uid, 'confirmed', 'signUp');
    await UserModel.updateStatus('confirmed', latestEmail.userId);
  }
}

export default EmailRepository;
