const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const ConfirmationMail = require('../models/confirmationMailModel');

class SignUpController {
    async signup(req, res, next) {
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
            if (temp.affectedRows) { 
                req.body.id = temp.insertId;           
                next();
            }
        } catch (error) {
            console.log("error ", error)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: "Registration failed. This email is already in use.",
                    data: "Conflict"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid registration request. Please check your input data and try again.",
                    data: "Bad Request"
              })
            }
        }
    }

    async validation(req, res) {
        try {
            const [ confirmationMail ] = await ConfirmationMail.getConfirmationMailById(req.query.id);
            if(confirmationMail.STATUS === "Confirmed"){
                return res.status(403 ).json({
                    success: false,
                    message: "The verification link has expired or the account is already activated.",
                    data: "Forbidden"
                });
            }else if(confirmationMail.CODE === req.query.code){
                const query = await ConfirmationMail.updateConfirmationMail(req.query.id, "Confirmed");
                if(query.affectedRows){
                    const rows = await User.updateUserStatus("Confirmed", confirmationMail.USER_ID);
                    if (rows.affectedRows) return res.status(200).json( {
                        success: true,
                        message: "The provided confirmation code is valid and can be used for user validation.",
                        data: "OK"
                    });
                    else return res.status(404).json({
                        success: false,
                        message: "User not found.",
                        data: "Not Found"
                    });
                } 
            } else return res.status(404).json({
                success: false,
                message: "The provided confirmation code does not exist or has expired.",
                data: "Not Found"
            });
        }
        catch (err){
            console.log(err);
            return res.status(400).json({
                success: false,
                message: "Not registered yet.",
                data: "Bad Request"
            })
        }
    }
}

module.exports = SignUpController;
