const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const authenticated = require('../verification/auth');
const jwt = require('jsonwebtoken');

const LogInController = require('../controllers/loginControllers');
const SignupController = require('../controllers/signupControllers');
const UserInfoController = require('../controllers/userinfoControllers');
const ImageController = require('../controllers/imageControllers');
const IngredientController = require('../controllers/ingredientControllers');
const RecipeController = require('../controllers/recipeControllers');
const DietRecordController = require('../controllers/dietRecordControllers');

const logInController = new LogInController();
const signUpController = new SignupController();
const userInfoController = new UserInfoController();
const imageController = new ImageController();
const ingredientController = new IngredientController();
const recipeController = new RecipeController();
const dietRecordController = new DietRecordController();

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

router.post('/api/signup', signUpController.signup);

router.get('/api/user/me', passport.authenticate('jwt', { session: true }), userInfoController.getUserInfoByUserId);

//upload
router.post('/api/upload/image', passport.authenticate('jwt', { session: true }), imageController.saveImage);

//ingredient
router.post('/api/food/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.addIngredient);

router.put('/api/food/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.updateIngredient);

router.get('/api/food/ingredient', passport.authenticate('jwt', { session: true }), ingredientController.getIngredients);

router.get('/api/food/ingredient/:id', passport.authenticate('jwt', { session: true }), ingredientController.getIngredientDetailById);

router.delete('/api/food/ingredient/:id', passport.authenticate('jwt', { session: true }), ingredientController.deleteIngredientsById);

//recipe
router.post('/api/food/recipe', passport.authenticate('jwt', { session: true }), recipeController.addRecipe);

router.put('/api/food/recipe', passport.authenticate('jwt', { session: true }), recipeController.updateRecipe);

router.get('/api/food/recipe', passport.authenticate('jwt', { session: true }), recipeController.getRecipes);

router.get('/api/food/recipe/:id', passport.authenticate('jwt', { session: true }), recipeController.getRecipeDetailById);

router.delete('/api/food/recipe/:id', passport.authenticate('jwt', { session: true }), recipeController.deleteRecipeById);

//record
router.get('/api/food/dietRecords', passport.authenticate('jwt', { session: true }), dietRecordController.getDietRecord);


module.exports = router;
