const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const imageController = new (require('../controllers/upload/imageControllers'))();

router.post('/image', auth, imageController.saveImage);

module.exports = router;