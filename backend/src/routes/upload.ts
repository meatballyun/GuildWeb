import express from 'express';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { ImageController } from '../controllers/upload/image';
import { verifyToken } from '../utils/verification';

const router = express.Router();

router.post('/images', verifyToken, awaitHandlerFactory(ImageController.saveImage));

export default router;
