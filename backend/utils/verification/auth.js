const ApplicationError = require('../error/applicationError.js');

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return next(new ApplicationError(401));
};

module.exports = authenticated;
