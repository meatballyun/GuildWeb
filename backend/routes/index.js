const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const authenticated = require('../verification/auth')
const jwt = require('jsonwebtoken');
const SignupController = require('../controllers/signupControllers');
const IngredientController = require('../controllers/ingredientControllers');
const signUpController = new SignupController();
const ingredientController = new IngredientController();

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
            console.log(req.session.passport.user.email);
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const payload = {
                id: user.user_id,
                email: user.email,
                name: user.name,
                iat: currentTimestamp,
            }
            const token = jwt.sign(payload, 'jwt-secret-key', { expiresIn: '10s' });
            //const decodedToken = jwt.decode(token);
            //console.log('payload : ', decodedToken);
            return res.status(200).json({ data: 'ok', token });
        });
    })(req, res, next)
})

router.post('/api/signup', signUpController.signup);

router.post('/api/ingredient', ingredientController.addIngredient);

router.post('/api/ingredientList', ingredientController.getIngredientsByCreator);

//router.get('/test', authenticated);


module.exports = router;
