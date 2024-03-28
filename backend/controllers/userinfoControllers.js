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
            if (jsObject[0]) {
                res.status(200).json({
                    name: jsObject[0].name,
                    id: req.session.passport.user,
                    imageUrl: null,
                })
            };
        } catch (error) {
            console.error(error);
            console.log('getUserInfoByUserId Error!!!');
        }
    }
}

module.exports = UserInfoController;
