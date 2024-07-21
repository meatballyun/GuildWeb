import express from 'express';
import { saveImage } from '../controllers';
import { verifyToken } from '../utils/token/verification';

const router = express.Router();

// Upload Image
router.post('/images', verifyToken, saveImage);

export default router;
