const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const nodemailer = require('nodemailer');

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yun.tz1114@gmail.com',
      pass: 'jvgpgkpqohamriki'
    },
    socketTimeout: 60000
});

const mailOptions = {
    from: 'yun.tz1114@gmail.com',
    to: 'rex.rex022534@gmail.com',
    subject: 'Hello User',
    text: 'Welcome to join the guild.'
};

router.get('/', passport.authenticate('jwt', { session: false }) );

router.get('/api/checkAuth', async (req, res)=>{     
  await transporter.sendMail(mailOptions, function(error, info){
    if(error){
       console.log(error);
    }else{
       console.log("Email sent: " + info.response);
    }
  })
});

//login
router.post('/api/login', logInController.login);

router.get('/api/logout', logInController.logout);

//signup
router.post('/api/signup', signUpController.signup);

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
