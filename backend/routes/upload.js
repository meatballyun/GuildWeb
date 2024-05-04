const express = require('express');
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const imageController = new (require('../controllers/upload/imageControllers'))();

router.post('/images', auth, imageController.saveImage);

//router.delete('/images/:url', auth, imageController.saveImage);

module.exports = router;
