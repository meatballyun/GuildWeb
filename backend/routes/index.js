const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const authenticated = require('../verification/auth');
const jwt = require('jsonwebtoken');
const SignupController = require('../controllers/signupControllers');
const IngredientController = require('../controllers/ingredientControllers');
//const UserInfoController = require('../controllers/userinfoControllers');
const signUpController = new SignupController();
const ingredientController = new IngredientController();
//const userInfoController = new UserInfoController();
const jwtConfig = require('../config/jwt');

// router.get('/', async (req, res) => {
//     console.log(req.session)
//     console.log(req.sessionID) 
// });

router.post('/api/login', function (req, res, next) {
    passport.authenticate('login', function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ data: info });
        };
        req.login(user, function (err) {            
            if (err) return next(err);
            const currentTimestamp = Math.floor(Date.now()/1000);
            const payload = {
                id: user.user_id,
                email: user.email,
                name: user.name,
                iat: currentTimestamp,
            };
            const token = jwt.sign(payload, jwtConfig.secret , { expiresIn: '600s' });
            res.status(200).json({ data: 'ok', token });
            console.log('User authenticated successfully.');
        });
    })(req, res, next);
});

router.get('/api/checkAuth', (req, res)=>{     
    console.log(req.session.fruit); 
    req.session.fruit = 'bbb';
    console.log("=============");
    res.json({});
    //res.end();
});

//router.get('/api/user/me', passport.authenticate('jwt', { session: true }), userInfoController.getUserInfoByUserId);

router.post('/api/signup', signUpController.signup);

router.post('/api/ingredient', ingredientController.addIngredient);

router.post('/api/ingredientList', ingredientController.getIngredientsByCreator);

//router.get('/test', authenticated);


module.exports = router;
