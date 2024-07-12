import express from 'express';
import { getNotifications, getNotificationDetail, uesNotification, deleteNotification } from '../controllers';
import { verifyToken } from '../utils/token/verification';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.get('/:nid', verifyToken, getNotificationDetail);
router.patch('/:nid', verifyToken, uesNotification);
//router.post('/', verifyToken, createNotification);
router.delete('/:nid', verifyToken, deleteNotification);

export default router;
