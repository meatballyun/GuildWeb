const User = require('../models/userModel');

class UserInfoController {
    async getUserInfoByUserId(req, res) {        
        try {
            const userid = await new Promise((resolve, reject) => {
                if (!req.session.passport.user) {
                    reject('');
                } else {
                    resolve(req.session.passport.user);
                }
            });
            const userinfo = await User.getUser(userid);
            const jsonData = JSON.stringify(userinfo);
            const jsObject = JSON.parse(jsonData);
            console.log(jsObject[0]);

            if (jsObject[0]) {
                const upgradeExp = (jsObject[0].RANK ** 3)*10;
                res.status(200).json({
                    name: jsObject[0].NAME,
                    id: jsObject[0].ID,
                    imageUrl: jsObject[0].IMAGE_URL,
                    rank: jsObject[0].RANK,
                    exp: jsObject[0].EXP,
                    upgradeExp: upgradeExp
                })
            };
        } catch (error) {
            console.log('getUserInfoByUserId Error!!!');
        }
    }
}

module.exports = UserInfoController;
