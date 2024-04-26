const express = require('express');
const router = express.Router();
const emails = require('./emails.js');
const users = require('./users.js');
const upload = require('./upload.js');
const foods = require('./foods.js');
const guilds = require('./guilds.js');
const notifications = require('./notifications.js');

//router.get('/checkAuth', taskController.updateTask);

router.use('/users', users);

router.use('/emails', emails);

router.use('/upload', upload);

router.use('/foods', foods);

router.use('/guilds', guilds);

router.use('/notifications', notifications);

module.exports = router;
