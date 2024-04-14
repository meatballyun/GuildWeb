const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const connection = require('../lib/db');

const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({
            "success": false,
            "message": "Unauthorized: You do not have permission to access.",
            "data": "Unauthorized"
          });
    }
};

module.exports = authenticated;