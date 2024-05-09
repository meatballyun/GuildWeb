const express = require('express');
const router = express.Router();
const emails = require('./emails.js');
const users = require('./users.js');
const upload = require('./upload.js');
const foods = require('./foods.js');
const guilds = require('./guilds.js');
const notifications = require('./notifications.js');
const taskScheduler = require('../scheduled/taskScheduler.js');
const awaitHandlerFactory = require('../utils/awaitHandlerFactory');


router.use('/users', users);
router.use('/emails', emails);
router.use('/upload', upload);
router.use('/foods', foods);
router.use('/guilds', guilds);
router.use('/notifications', notifications);

awaitHandlerFactory(taskScheduler.start());



module.exports = router;
