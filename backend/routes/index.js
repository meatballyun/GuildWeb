const express = require('express');
const router = express.Router();
const signup = require('./signup.js');
const email = require('./email.js');
const user = require('./user.js');
const upload = require('./upload.js');
const food = require('./food.js');
const guild = require('./guild.js');
const task = require('./task.js');
const passport = require('../verification/passport');
const LogInController = require('../controllers/loginControllers');
const logInController = new LogInController();

const GuildController = require('../controllers/guildControllers');
const guildController = new GuildController();
const UserGuildRelationController = require('../controllers/userGuildRelationControllers');
const userGuildRelationController = new UserGuildRelationController();

const TaskController = require('../controllers/taskControllers');
const taskController = new TaskController();

//router.get('/', passport.authenticate('jwt', { session: false }) );
router.get('/checkAuth', taskController.updateTask);

router.post('/login', logInController.login);

router.get('/logout', logInController.logout);

router.use('/signup', signup);

router.use('/email', email);

router.use('/user', user);

router.use('/upload', upload);

router.use('/food', food);

router.use('/guild', guild);

router.use('/task', task);

module.exports = router;
