import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';
import { toHash } from '../../utils/hashCode';
import { ApplicationError } from '../../utils/error/applicationError';
import { signUpEmail, passwordResetEmail } from './emailTemplate';
import { UserModel, ConfirmationEmailModel } from '../../models';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASS,
  },
  socketTimeout: 60000,
});

export const sendEmail = async (emailOptions: Mail.Options) => {
  transporter.sendMail(emailOptions, function (err, info) {
    if (err) throw new ApplicationError(400);
  });
};

export const sendSignUp = async ({ uid, email }: { uid: number; email: string }) => {
  const confirmationMail = await ConfirmationEmailModel.getLatestByUser(uid, 'signUp');

  const hasConfirmationMail = confirmationMail?.length;
  if (hasConfirmationMail) throw new ApplicationError(409);

  const code = await toHash(uid + email + 'signUp');
  await ConfirmationEmailModel.create(uid, 'signUp', code);

  sendEmail(signUpEmail(email, uid, code));
};

export const resendSignUp = async (email: string) => {
  const user = await UserModel.getOneByEmail(email);
  if (!user?.id) throw new ApplicationError(404);
  if (user.status === 'confirmed') throw new ApplicationError(409);

  const latestEmail = await ConfirmationEmailModel.getLatestByUser(user.id, 'signUp');
  if (!latestEmail) sendSignUp({ uid: user.id, email });
  else sendEmail(signUpEmail(email, user.id, latestEmail.code));
};

export const sendResetPassword = async (email: string) => {
  const user = await UserModel.getOneByEmail(email);
  if (!user) throw new ApplicationError(404);

  const latestEmail = await ConfirmationEmailModel.getLatestByUser(user.id, 'signUp');
  if (!latestEmail) throw new ApplicationError(404);
  if (latestEmail.status === 'pending') throw new ApplicationError(403);

  const code = await toHash(user.id + email + 'forgotPassword');
  await ConfirmationEmailModel.create(user.id, 'forgotPassword', code);
  sendEmail(passwordResetEmail(email, user.id, code));
};

export const validationResetPassword = async ({ uid, code }: { uid: number; code: string }) => {
  const latestEmail = await ConfirmationEmailModel.getLatestByUser(uid, 'forgotPassword');
  if (!latestEmail) throw new ApplicationError(400);
  if (latestEmail.status === 'confirmed') throw new ApplicationError(403);

  if (new Date(latestEmail.createTime).valueOf() + 86400000 < new Date().valueOf()) throw new ApplicationError(403);
  if (latestEmail.code !== code) throw new ApplicationError(404);

  await ConfirmationEmailModel.update(uid, 'confirmed', 'forgotPassword');
};

export const validationSignUp = async ({ uid, code }: { uid: number; code: string }) => {
  const latestEmail = await ConfirmationEmailModel.getLatestByUser(uid, 'signUp');
  if (!latestEmail) throw new ApplicationError(400);
  if (latestEmail.status === 'confirmed') throw new ApplicationError(403);
  if (latestEmail.code !== code) throw new ApplicationError(404);

  await ConfirmationEmailModel.update(uid, 'confirmed', 'signUp');
  await UserModel.updateStatus('confirmed', latestEmail.userId);
};
