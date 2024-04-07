const User = require('../models/userModel');

class UserInfoController {
    async getUserInfoByUserId(req, res) {        
        try {
            const USERID = req.session.passport.user;
            const userinfo = await User.getUserById(USERID);
            if (userinfo?.[0]) {
                const { NAME, ID, IMAGE_URL, RANK, EXP } = userinfo[0];
                const upgradeExp = (RANK ** 3) * 10;
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
        console.log('updateUserExp');       
        try {            
            const query = await User.updateUserExp(EXP, ID);
            console.log(query);
            const RANK = await User.getUserRankById(ID);
            const upgradeExp = (RANK ** 3) * 10;
            if (EXP > upgradeExp) {
                await this.updateUserRank(RANK + 1, ID);
            }
        } catch (err) {
            console.log(err);
            console.log('updateUserExp Error!!!');
        }
    }

}

module.exports = UserInfoController;
