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
                    name: NAME,
                    id: ID,
                    imageUrl: IMAGE_URL,
                    rank: RANK,
                    exp: EXP,
                    upgradeExp
                });
            }
        } catch (error) {
            console.log('getUserInfoByUserId Error!!!');
        }
    }

    async updateUserExp(EXP, ID) {     
        try {  
            const userInfo = await User.getUserById(ID);
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
