import express from 'express';
import { signup, login, completeOnboarding } from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.put('/onboarding', completeOnboarding);

export default router;
