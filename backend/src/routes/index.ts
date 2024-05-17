import express from 'express';
import emails from './emails';
import users from './users';
import upload from './upload';
import foods from './foods';
import guilds from './guilds';
import notifications from './notifications';
import taskScheduler from '../scheduled/taskScheduler';
import awaitHandlerFactory from '../utils/awaitHandlerFactory';

const router = express.Router();
router.use('/users', users);
router.use('/emails', emails);
router.use('/upload', upload);
router.use('/foods', foods);
router.use('/guilds', guilds);
router.use('/notifications', notifications);

awaitHandlerFactory(taskScheduler.start());

export default router;
