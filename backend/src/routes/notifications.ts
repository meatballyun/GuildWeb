import express from 'express';
import { getNotifications, getNotificationDetail, uesNotification, deleteNotification } from '../controllers';
import { verifyToken } from '../utils/token/verification';

const router = express.Router();

// Notification // nid: Notification ID
// Get all notifications for the user.
router.get('/', verifyToken, getNotifications);

// Get the notification
router.get('/:nid', verifyToken, getNotificationDetail);

// Use the notification
router.patch('/:nid', verifyToken, uesNotification);

// Create the notification // TODO: Awaiting backend development.
//router.post('/', verifyToken, createNotification);

// Delete the notification
router.delete('/:nid', verifyToken, deleteNotification);

export default router;
