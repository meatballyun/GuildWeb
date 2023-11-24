const bcrypt = require('bcrypt');
const User = require('../models/userModel');


class SignUpController {
    async signup(req, res) {
        try {
            console.log(req.body.name, req.body.email, req.body.password);
            const password = await new Promise((resolve, reject) => {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        console.log('Hashed Password:', hash);
                        resolve(hash);
                    }
                });
            });
            const user = await User.signUp(req.body.name, req.body.email, password);
            console.log(user);

        } catch (error) {
            console.error(error);
            console.log('signup Error!!!');
        }
    }
}

module.exports = SignUpController;