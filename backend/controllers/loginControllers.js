const passport = require('../verification/passport');
const jwt = require('jsonwebtoken');

class LogInController {
    async login(req, res, next) {
        try {
            passport.authenticate('login', async function (err, user, info) {            
                if (err) {
                    console.log(err)
                } else if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: info,
                        error: "Unauthorized"
                    });
                } else if(user.STATUS === "Pending"){
                    return res.status(403).json({
                        success: false,
                        message: "Email verification required. Please verify your email address to perform this action.",
                        error: "Forbidden"
                    });
                } else {
                    req.login(user, function (err) {           
                        if (err) return next(err);
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
            return res.status(400).json({
                success: false,
                message: "Bad Request: The process is invalid.",
                data: "Bad Request"
            });
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
