const User = require('../models/userModel');
class UserInfoController {
    async getUserInfoByUserId(req, res) {        
        try {
            const USERID = req.session.passport.user;
            const userinfo = await User.getUserById(USERID);
            if (userinfo?.[0]) {
                const { NAME, ID, IMAGE_URL, RANK, EXP } = userinfo[0];
                const upgradeExp = (RANK ** 2) * 10;
                res.status(200).json({
                    success: true,
                    message: "User data retrieval successful",
                    data: {
                        name: NAME,
                        id: ID,
                        imageUrl: IMAGE_URL,
                        rank: RANK,
                        exp: EXP,
                        upgradeExp: upgradeExp
                    }                    
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Not Found: The requested user was not found in the database.",
                    data: "Not Found"
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Bad Request: The request cannot be processed due to invalid information.",
                data: "Bad Request"
            });
        }
    }

    async updateUserTarget(req, res) {        
        try {
            const ID = req.session.passport.user;
            await User.updateUserTarget(ID, req.body.carbs, req.body.pro, req.body.fats, req.body.kcal);
            
        } catch (error) {
            console.log('getUserInfoByUserId Error!!!');
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
