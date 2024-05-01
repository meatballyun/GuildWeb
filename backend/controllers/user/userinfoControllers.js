const User = require('../../models/userModel');
const bcrypt = require('bcrypt');
const ConfirmationMail = require('../../models/confirmationMailModel');
const ApplicationError = require('../../utils/error/applicationError.js');

class UserInfoController {
    async getUserInfoByUserId(req, res, next) {        
        try {
            const [ userInfo ] = await User.getUserById(req.session.passport.user);
            if (userInfo) {
                const upgradeExp = ((userInfo.RANK ** 2.8)* 10).toFixed(0) ;
                res.status(200).json({
                    success: true,
                    message: "User data retrieval successful",
                    data: {
                        id: userInfo.ID,
                        name: userInfo.NAME,
                        email: userInfo.EMAIL,
                        imageUrl: userInfo.IMAGE_URL,
                        rank: userInfo.RANK,
                        exp: userInfo.EXP,
                        upgradeExp: upgradeExp,
                        carbs: userInfo.CARBS,
                        pro: userInfo.PRO,
                        fats: userInfo.FATS,
                        kcal: userInfo.KCAL
                    }                    
                });
            }
            else {
                return next(new ApplicationError(404));
            }
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async resetPassword(req, res, next) {        
        try {
            const [confirmationMail] = await ConfirmationMail.getConfirmationMailByUserId(req.body.uid, "ForgotPassword");
            if(confirmationMail.STATUS !== "Confirmed" || ((new Date(confirmationMail.CREATE_TIME).valueOf()+86400000) < new Date().valueOf())){
                return next(new ApplicationError(403, "The verification link has expired."));
            } else if(confirmationMail.CODE === req.body.code){
                const password = await new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hash);
                        }
                    });
                });
                const query =  await User.updateUserPassword(req.body.uid, password);
                if (query.affectedRows) {
                    return res.status(200).json({
                        success: true,
                        message: "Password updated successfully.",
                        data: "OK"
                    });
                } else{
                    return next(new ApplicationError(404));
                }
            }
            
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async updateUserInfo(req, res, next) {        
        try {
            const query =  await User.updateUserInfo(req.session.passport.user, req.body.name, req.body.imageUrl, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal);
            if (query.affectedRows) {
                return res.status(200).json({
                    success: true,
                    message: "Data updated successfully.",
                    data: {
                        id: req.session.passport.user
                    }
                });
            } else {
                return next(new ApplicationError(404));
            }
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async updateUserExp(EXP, ID) {     
        try {  
            const [userInfo] = await User.getUserById(ID);
            if (userInfo.RANK === 99) return;
            const newEXP = EXP + userInfo.EXP;
            if (newEXP < 0) newEXP = 0;
            await User.updateUserExp(newEXP, ID);
            const upgradeExp = ((userInfo.RANK ** 2.8)* 10).toFixed(0);
            if (newEXP >= upgradeExp) {
                await User.updateUserRank(userInfo.RANK + 1, ID);
                await User.updateUserExp(0, ID);
            }
            return;
        } catch (err) {
            throw (new ApplicationError(400, err))
        }
    }

}

module.exports = UserInfoController;
