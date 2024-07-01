import express from 'express';
import passport from '../utils/verification/passport';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { NotificationController } from '../controllers/notification/notification';

const auth = passport.authenticate('jwt', { session: true });
const router = express.Router();

router.get('/', auth, awaitHandlerFactory(NotificationController.getNotifications));
router.get('/:nid', auth, awaitHandlerFactory(NotificationController.getNotificationDetail));
router.patch('/:nid', auth, awaitHandlerFactory(NotificationController.uesNotification));
//router.post('/', auth, NotificationController.createNotification);
router.delete('/:nid', auth, awaitHandlerFactory(NotificationController.deleteNotification));

export default router;
