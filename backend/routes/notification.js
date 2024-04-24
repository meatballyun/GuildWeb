const express = require("express")
const router = express.Router();
const notification = new (require('../controllers/notification/notificationControllers'))();

router.get('/notification', notification.getNotifications);

router.get('/notification/:nid', notification.getNotificationDetail);

router.post('/notification', notification.addNotification);

router.delete('/notification/:nid', notification.deleteNotification);

module.exports = router;