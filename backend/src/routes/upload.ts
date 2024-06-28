import express from 'express';
import passport from '../utils/verification/passport';
import awaitHandlerFactory from '../utils/awaitHandlerFactory';
import { ImageController } from '../controllers/upload/imageControllers';

const auth = passport.authenticate('jwt', { session: true });
const router = express.Router();
router.post('/images', auth, awaitHandlerFactory(ImageController.saveImage));

export default router;
