const ApplicationError = require('../utils/error/applicationError.js');

const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return next(new ApplicationError(401, "Unauthorized: You do not have permission to access."));
    }
};

module.exports = authenticated;