const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const awaitHandlerFactory = require('../utils/awaitHandlerFactory');
const notification = new (require('../controllers/notification/notificationControllers'))();

router.get('/', auth, awaitHandlerFactory(notification.getNotifications));
router.get('/:nid', auth, awaitHandlerFactory(notification.getNotificationDetail));
router.patch('/:nid', auth, awaitHandlerFactory(notification.uesNotification));
//router.post('/', auth, notification.createNotification);
router.delete('/:nid', auth, awaitHandlerFactory(notification.deleteNotification));

module.exports = router;
