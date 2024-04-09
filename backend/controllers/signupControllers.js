const bcrypt = require('bcrypt');
const User = require('../models/userModel');

class SignUpController {
    async signup(req, res) {
        try {
            const password = await new Promise((resolve, reject) => {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
            const temp = await User.signUp(req.body.name, req.body.email, password);
            
            if (temp) res.status(200).json({
                status: "success",
                message: "User registered successfully",    
            });

        } catch (error) {
            console.error(error);
            console.log('signup Error!!!');
        }
    }
}

module.exports = SignUpController;
