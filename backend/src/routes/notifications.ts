import express from 'express';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { NotificationController } from '../controllers/notification/notification';
import { verifyToken } from '../utils/verification';

const router = express.Router();

router.get('/', verifyToken, awaitHandlerFactory(NotificationController.getNotifications));
router.get('/:nid', verifyToken, awaitHandlerFactory(NotificationController.getNotificationDetail));
router.patch('/:nid', verifyToken, awaitHandlerFactory(NotificationController.uesNotification));
//router.post('/', verifyToken, NotificationController.createNotification);
router.delete('/:nid', verifyToken, awaitHandlerFactory(NotificationController.deleteNotification));

export default router;
