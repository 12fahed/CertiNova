import express from 'express';
import { signup, login, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);

// Profile routes (authenticated)
router.patch('/profile', authenticate, updateProfile);

export default router;
