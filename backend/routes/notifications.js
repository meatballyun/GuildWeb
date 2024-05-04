const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const notification = new (require('../controllers/notification/notificationControllers'))();

router.get('/', auth, notification.getNotifications);
router.get('/:nid', auth, notification.getNotificationDetail);
router.patch('/:nid', auth, notification.uesNotification);
//router.post('/', auth, notification.addNotification);
router.delete('/:nid', auth, notification.deleteNotification);

module.exports = router;
