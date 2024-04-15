const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const ImageController = require('../controllers/imageControllers');
const imageController = new ImageController();


router.post('/image', passport.authenticate('jwt', { session: true }), imageController.saveImage);

module.exports = router;