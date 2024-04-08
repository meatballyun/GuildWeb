const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const authenticated = require('../verification/auth');
const jwt = require('jsonwebtoken');
const LogInController = require('../controllers/loginControllers');
const SignupController = require('../controllers/signupControllers');
const IngredientController = require('../controllers/ingredientControllers');
const UserInfoController = require('../controllers/userinfoControllers');
const logInController = new LogInController();
const signUpController = new SignupController();
const ingredientController = new IngredientController();
const userInfoController = new UserInfoController();


router.get('/', passport.authenticate('jwt', { session: false }) );

router.post('/api/login', logInController.login);

router.delete('/api/login', logInController.logout);

router.get('/api/checkAuth', passport.authenticate('jwt', { session: false }), (req, res)=>{     
    console.log(req.session); 
    req.session.fruit = 'bbb';
    console.log("=============");
    res.json({});
    //res.end();
});

router.get('/api/user/me', passport.authenticate('jwt', { session: true }), userInfoController.getUserInfoByUserId);

router.post('/api/signup', signUpController.signup);

router.post('/api/food/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.addNewIngredient);

router.put('/api/food/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.updateIngredient);

router.get('/api/food/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.getIngredientsByCreator);

router.get('/api/food/ingredient/:id', passport.authenticate('jwt', { session: true }), ingredientController.getIngredientDetailById);

router.delete('/api/food/ingredient/:id', passport.authenticate('jwt', { session: true }), ingredientController.deleteIngredientsById);

module.exports = router;
