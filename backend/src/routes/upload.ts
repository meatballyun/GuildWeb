import express from 'express';
import passport from '../utils/verification/passport';
import awaitHandlerFactory from '../utils/awaitHandlerFactory';
import ImageControllers from '../controllers/upload/imageControllers';

const auth = passport.authenticate('jwt', { session: true });
const router = express.Router();
const imageController = new ImageControllers();
router.post('/images', auth, awaitHandlerFactory(imageController.saveImage));

export default router;
