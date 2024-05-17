// @ts-nocheck
import express from 'express';
import passport from '../utils/verification/passport';
import awaitHandlerFactory from '../utils/awaitHandlerFactory';
import notification from '../controllers/notification/notificationControllers';

const auth = passport.authenticate('jwt', { session: true });
const router = express.Router();

router.get('/', auth, awaitHandlerFactory(notification.getNotifications));
router.get('/:nid', auth, awaitHandlerFactory(notification.getNotificationDetail));
router.patch('/:nid', auth, awaitHandlerFactory(notification.uesNotification));
//router.post('/', auth, notification.createNotification);
router.delete('/:nid', auth, awaitHandlerFactory(notification.deleteNotification));

export default router;
