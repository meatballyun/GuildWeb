const nodemailer = require('nodemailer');
const ApplicationError = require('../../utils/error/applicationError.js');
const ConfirmationEmail = require('../../models/email/confirmationEmail.model.js');
const User = require('../../models/user/user.model.js');
const EmailRepository = new (require('../../repositories/email/email.repository.js'))();

class MailController {
  async sendSignUp(req, res, next) {
    const result = await EmailRepository.sendSignUp(req.body.uid, req.body.email);
    return res.status(200).json({ data: result });
  }

  async resendSignUp(req, res, next) {
    const result = await EmailRepository.resendSignUp(req.body.email);
    return res.status(200).json({ data: result });
  }

  async sendResetPassword(req, res, next) {
    const result = await EmailRepository.sendResetPassword(req.body.email);
    return res.status(200).json({ data: result });
  }

  async validationResetPassword(req, res, next) {
    const result = await EmailRepository.validationResetPassword(req.query);
    return res.status(200).json({ data: result });
  }

  async validationSignUp(req, res, next) {
    const result = await EmailRepository.validationSignUp(req.query);
    return res.status(200).json({ data: result });
  }
}

module.exports = MailController;
