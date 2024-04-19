const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const ImageController = require('../controllers/imageControllers');
const imageController = new ImageController();

router.post('/image', auth, imageController.saveImage);

module.exports = router;