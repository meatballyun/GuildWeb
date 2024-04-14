const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');

const LogInController = require('../controllers/loginControllers');
const SignupController = require('../controllers/signupControllers');
const MailController = require('../controllers/mailControllers');
const UserInfoController = require('../controllers/userinfoControllers');
const ImageController = require('../controllers/imageControllers');
const IngredientController = require('../controllers/ingredientControllers');
const RecipeController = require('../controllers/recipeControllers');
const DietRecordController = require('../controllers/dietRecordControllers');

const logInController = new LogInController();
const signUpController = new SignupController();
const mailUpController = new MailController();
const userInfoController = new UserInfoController();
const imageController = new ImageController();
const ingredientController = new IngredientController();
const recipeController = new RecipeController();
const dietRecordController = new DietRecordController();

router.get('/', passport.authenticate('jwt', { session: false }) );

router.get('/api/checkAuth', mailUpController.resendSignUpMail);

//login
router.post('/api/login', logInController.login);
router.get('/api/logout', logInController.logout);

//signup
router.post('/api/signup', signUpController.signup, mailUpController.sendSignUpMail);
router.get('/api/signup', signUpController.validation);

//mail
router.post('/api/email/resend', mailUpController.resendSignUpMail);

//user
router.get('/api/user/me', passport.authenticate('jwt', { session: true }), userInfoController.getUserInfoByUserId);
router.put('/api/user/me', passport.authenticate('jwt', { session: true }), userInfoController.updateUserTarget);

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
router.post('/api/food/dietRecords', passport.authenticate('jwt', { session: true }), dietRecordController.addDietRecord);
router.get('/api/food/dietRecords', passport.authenticate('jwt', { session: true }), dietRecordController.getDietRecord);
router.delete('/api/food/dietRecords/:id', passport.authenticate('jwt', { session: true }), dietRecordController.deleteDietRecord);

module.exports = router;
