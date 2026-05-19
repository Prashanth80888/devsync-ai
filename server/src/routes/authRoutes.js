import express from 'express';
import { registerUser, loginUser, getCurrentUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for user onboarding and session validation
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected profile verification endpoint route
router.get('/me', protect, getCurrentUserProfile);

export default router;