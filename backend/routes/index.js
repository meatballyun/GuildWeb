const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const authenticated = require('../verification/auth');
const jwt = require('jsonwebtoken');
const SignupController = require('../controllers/signupControllers');
const IngredientController = require('../controllers/ingredientControllers');
const signUpController = new SignupController();
const ingredientController = new IngredientController();
const jwtConfig = require('../config/jwt');

router.get('/', async (req, res) => {
});

router.post('/api/login', function (req, res, next) {
    passport.authenticate('login', function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ data: info });
        };
        req.login(user, function (err) {            
            if (err) return next(err);
            //console.log("------------------\n", req.session);
            const currentTimestamp = Math.floor(Date.now()/1000);
            const payload = {
                id: user.user_id,
                email: user.email,
                name: user.name,
                iat: currentTimestamp,
            }
            const token = "Bearer " + jwt.sign(payload, jwtConfig.secret , { expiresIn: '600s' });
            return res.status(200).json({ data: 'ok', token });
        });
    })(req, res, next)
}, () => {
    console.log();
}
);

router.get('/api/checkAuth', authenticated, (req, res) => {
    console.log("Success!");
});


router.post('/api/signup', signUpController.signup);

router.post('/api/ingredient', ingredientController.addIngredient);

router.post('/api/ingredientList', ingredientController.getIngredientsByCreator);

//router.get('/test', authenticated);


module.exports = router;
