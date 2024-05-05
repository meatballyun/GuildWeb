const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const awaitHandlerFactory = require('../utils/awaitHandlerFactory');
const imageController = new (require('../controllers/upload/imageControllers'))();

router.post('/images', auth, awaitHandlerFactory(imageController.saveImage));

//router.delete('/images/:url', auth, imageController.saveImage);

module.exports = router;
