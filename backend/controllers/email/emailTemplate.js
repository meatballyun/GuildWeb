const ADDRESS = process.env.NODE_ENV === 'development' ? process.env.TEST_MAIL : EMAIL;
const VALIDATION_URL =
  process.env.NODE_ENV === 'development' ? process.env.FE_URL : process.env.API_SERVICE_URL;

const signUpEmail = (EMAIL, ID, CODE) => {
  {
    return {
      from: process.env.MAIL_ADDRESS,
      to: ADDRESS,
      subject: 'Hello User',
      html: `
          <p>This email sincerely invites you to join Guild.</p>
          <p>Brave adventurers, please activate the magic emblem below to join our ranks.</p>
          <a href="${VALIDATION_URL}/validation?uid=${ID}&code=${CODE}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>(If you did not request this verification, please ignore this email.)</p>
      `,
    };
  }
};

const passwordResetEmail = (EMAIL, ID, CODE) => {
  {
    return {
      from: process.env.MAIL_ADDRESS,
      to: ADDRESS,
      subject: 'Password Reset Request',
      html: `
      <p>Hello,</p>
      <p>We received a request to reset the password associated with this email address. If you did not make this request, you can safely ignore this email.</p>
      <p>To reset your password, please click on the link below:</p>
      <a href="${VALIDATION_URL}/password-reset?uid=${ID}&code=${CODE}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If the above link doesn't work, you can copy and paste the following URL into your web browser:</p>
      <p>${VALIDATION_URL}/password-reset?uid=${ID}&code=${CODE}</p>
      <p>This link will expire in 24 hours for security reasons.</p>
      <p>Thank you,</p>
      <p>The Guild Team</p>
      `,
    };
  }
};

module.exports = { signUpEmail, passwordResetEmail };
