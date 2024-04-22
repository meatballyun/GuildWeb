const express = require('express');
const router = express.Router();
const email = require('./email.js');
const user = require('./user.js');
const upload = require('./upload.js');
const food = require('./food.js');
const guild = require('./guild.js');

//router.get('/checkAuth', taskController.updateTask);

router.use('/user', user);

router.use('/email', email);

router.use('/upload', upload);

router.use('/food', food);

router.use('/guild', guild);


module.exports = router;
