const EmailRepository = require('../../repositories/email/email.repository.js');

class MailController {
  static async sendSignUp(req, res, next) {
    await EmailRepository.sendSignUp(req.body.uid, req.body.email);
    return res.status(200).json({ data: 'OK' });
  }

  static async resendSignUp(req, res, next) {
    await EmailRepository.resendSignUp(req.body.email);
    return res.status(200).json({ data: 'OK' });
  }

  static async sendResetPassword(req, res, next) {
    await EmailRepository.sendResetPassword(req.body.email);
    return res.status(200).json({ data: 'OK' });
  }

  static async validationResetPassword(req, res, next) {
    await EmailRepository.validationResetPassword(req.query);
    return res.status(200).json({ data: 'OK' });
  }

  static async validationSignUp(req, res, next) {
    await EmailRepository.validationSignUp(req.query);
    return res.status(200).json({ data: 'OK' });
  }
}

module.exports = MailController;
