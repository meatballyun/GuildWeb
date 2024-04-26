const User = require('../../models/userModel');
const ConfirmationMail = require('../../models/confirmationMailModel');
const ApplicationError = require('../../utils/error/applicationError.js');

class UserInfoController {
    async getUserInfoByUserId(req, res, next) {        
        try {
            const [ userinfo ] = await User.getUserById(req.session.passport.user);
            if (userinfo) {
                const upgradeExp = (userinfo.RANK ** 2) * 10;
                res.status(200).json({
                    success: true,
                    message: "User data retrieval successful",
                    data: {
                        id: userinfo.ID,
                        name: userinfo.NAME,
                        email: userinfo.EMAIL,
                        imageUrl: userinfo.IMAGE_URL,
                        rank: userinfo.RANK,
                        exp: userinfo.EXP,
                        upgradeExp: upgradeExp,
                        carbs: userinfo.CARBS,
                        pro: userinfo.PRO,
                        fats: userinfo.FATS,
                        kcal: userinfo.KCAL
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
            const [confirmationMail] = await ConfirmationMail.getConfirmationMailByUserId(req.query.uid, "ForgotPassword");
            if(confirmationMail.STATUS === "Confirmed" || (new Date(confirmationMail.CREATE_TIME)+86400000) < new Date() ){
                return next(new ApplicationError(403, "The verification link has expired."));
            } else if(confirmationMail.CODE === req.query.code){
                const password = await new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hash);
                        }
                    });
                });
                const query =  await User.updateUserPassword(password, req.body.uid);
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
            } else{
                return next(new ApplicationError(404));
            }
        } catch (err) {
            return next(new ApplicationError(400, err));
        }
    }

    async updateUserExp(EXP, ID) {     
        try {  
            const userInfo = await User.getUserById(ID);
            if (userInfo[0].RANK === 50) return;
            const newEXP = EXP + userInfo[0].EXP;
            await User.updateUserExp(newEXP, ID);
            const upgradeExp = (userInfo[0].RANK ** 2) * 10;
            console.log(upgradeExp);
            if (newEXP >= upgradeExp) {
                await User.updateUserRank(userInfo[0].RANK + 1, ID);
            }
            return;
        } catch (err) {
            throw (new ApplicationError(400, err))
        }
    }

}

module.exports = UserInfoController;
