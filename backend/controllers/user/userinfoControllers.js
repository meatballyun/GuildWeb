const User = require('../../models/userModel');
const ApplicationError = require('../../utils/error/applicationError.js');

class UserInfoController {
    async getUserInfoByUserId(req, res) {        
        try {
            const ID = req.session.passport.user;
            const [ userinfo ] = await User.getUserById(ID);
            if (userinfo) {
                const upgradeExp = (userinfo.RANK ** 2) * 10;
                res.status(200).json({
                    success: true,
                    message: "User data retrieval successful",
                    data: {
                        name: userinfo.NAME,
                        id: userinfo.ID,
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
        } catch (error) {
            return next(new ApplicationError(400));
        }
    }

    async updateUserInfo(req, res) {        
        try {
            const ID = req.session.passport.user;
            const query =  await User.updateUserInfo(ID, req.body.name, req.body.imageUrl, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal);
            if (query.affectedRows) {
                return res.status(200).json({
                    success: true,
                    message: "Data updated successfully.",
                    data: "OK"
                });
            } else{
                return next(new ApplicationError(404));
            }
        } catch (error) {
            return next(new ApplicationError(400));
        }
    }

    async updateUserExp(EXP, ID) {     
        try {  
            const userInfo = await User.getUserById(ID);
            if (userInfo[0].RANK = 99) return;
            const newEXP = EXP + userInfo[0].EXP;
            await User.updateUserExp(newEXP, ID);
            console.log('updateUserExp'); 
            const upgradeExp = (userInfo[0].RANK ** 2) * 10;
            if (newEXP > upgradeExp) {
                console.log('updateUserRank');
                await User.updateUserRank(userInfo[0].RANK + 1, ID);
            }
        } catch (err) {
            console.log(err);
            console.log('updateUserExp Error!!!');
        }
    }

}

module.exports = UserInfoController;
