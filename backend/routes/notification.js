const express = require("express")
const router = express.Router();
const Notification = new (require('../controllers/notification/notificationControllers'))();

router.get('/notification', Notification.getNotifications);

router.get('/notification/:nid', Notification.getNotificationDetail);

router.post('/notification', Notification.addNotification);

router.delete('/notification:nid', Notification.deleteNotification);

module.exports = router;