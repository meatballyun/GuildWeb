const bcrypt = require('bcrypt');
const User = require('../../models/userModel');
const ConfirmationMail = require('../../models/confirmationMailModel');
const ApplicationError = require('../../utils/error/applicationError.js');

class SignUpController {
    async signup(req, res, next) {
        try {
            const password = await new Promise((resolve, reject) => {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
            const signUp = await User.signUp(req.body.name, req.body.email, password);
            if (signUp.affectedRows) {       
                req.body.uid  = signUp.insertId
                next();
            }
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next(new ApplicationError(409, "Registration failed. This email is already in use."));
            } else {
                return next(new ApplicationError(400, "Invalid registration request. Please check your input data and try again."));
            }
        }
    }

}

module.exports = SignUpController;
