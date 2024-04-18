const express = require('express');
const router = express.Router();
const signup = require('./signup.js');
const email = require('./email.js');
const user = require('./user.js');
const upload = require('./upload.js');
const food = require('./food.js');
const guild = require('./guild.js');
const passport = require('../verification/passport');
const LogInController = require('../controllers/loginControllers');
const logInController = new LogInController();

function middleware1(req, res, next) {
  //throw new Error('fake error by throw');   
  //next(new Error('fake error by next()'));
  //return;  
  req.a = 15;
  next(); 
  console.log('middleware1');
  //res.send('搶先送出回應');
}
function middleware2(req, res, next) {
  console.log('middleware2');
  console.log(req.a);
  next(); 
}
router.get('/middleware', middleware1, middleware2, function (req, res) {
  console.log('final');
  res.send('done');
});

//router.get('/checkAuth', taskController.updateTask);

router.post('/login', logInController.login);

router.get('/logout', logInController.logout);

router.use('/signup', signup);

router.use('/email', email);

router.use('/user', user);

router.use('/upload', upload);

router.use('/food', food);

router.use('/guild', guild);

module.exports = router;
