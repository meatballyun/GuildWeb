const passport = require('../../verification/passport.js');
const jwt = require('jsonwebtoken');
const ApplicationError = require('../../utils/error/applicationError.js');

class LogInController {
    async login(req, res, next) {
        try {
            passport.authenticate('login', async function (err, user, info) {            
                if (err) {
                    return next(new ApplicationError(500, err));
                } else if (!user) {
                    return next(new ApplicationError(401, info));
                } else if(user.STATUS === "Pending"){
                    return next(new ApplicationError(403, 'Email verification required. Please verify your email address to perform this action.'));
                } else {
                    req.login(user, function (err) {           
                        if (err) return next(new ApplicationError(403, err));
                        const currentTimestamp = Math.floor(Date.now()/1000);
                        const payload = {
                            id: user.ID,
                            email: user.EMAIL,
                            name: user.NAME,
                            iat: currentTimestamp,
                        };
                        const token = jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: '1d' });
                        return res.status(200).json({
                            success: true,
                            message: "logged in",
                            data: {
                                "token": token
                            }
                        });
                    });
                }
            })(req, res, next);
        }
        catch {
            return next(new ApplicationError(400));
        }
    }

    async logout(req, res) {
        req.logout(() => {
            res.status(200).json({
            success: true,
            message: "log out",
            data: "Ok"
          }); 
        });
    }
}

module.exports = LogInController;
