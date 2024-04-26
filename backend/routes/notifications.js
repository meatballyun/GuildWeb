const express = require("express")
const router = express.Router();
const notification = new (require('../controllers/notification/notificationControllers'))();

router.get('/notifications', notification.getNotifications);

router.get('/notifications/:nid', notification.getNotificationDetail);

router.post('/notifications', notification.addNotification);

router.delete('/notifications/:nid', notification.deleteNotification);

module.exports = router;