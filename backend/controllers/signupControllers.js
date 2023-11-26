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
            const temp = await User.signUp(req.body.name, req.body.email, password);
            if (!temp) res.status(200).json({
                "status": "success",
                "message": "User registered successfully",
                "user": {
                    "email": req.body.email,
                    "name": req.body.name
                }
            }
            );

        } catch (error) {
            console.error(error);
            console.log('signup Error!!!');
        }
    }

    // async findUser(req, res) {
    //     try {
    //         const temp = User.getUser(req.body.email);
    //         if ()
    //     } catch (error) {
    //         console.error(error);
    //         console.log('not find!');
    //     }
    // }
}

module.exports = SignUpController;