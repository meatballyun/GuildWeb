const passport = require('../verification/passport');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class LogInController {
    async login(req, res, next) {
        passport.authenticate('login', function (err, user, info) {            
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    "success": false,
                    "message": info,
                    "error": "Unauthorized"
                  });
            };
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
        })(req, res, next);
    }

    async logout(req, res) {
        req.logout(() => { 
            res.status(200).json({
            "success": true,
            "message": "log out",
            "data": "Ok"
          }); 
        });
    }
}

module.exports = LogInController;
