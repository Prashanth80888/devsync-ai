import express from 'express';
import { updateCurrentUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce standard JWT system authentication on all configuration pathways
router.use(protect);

router.route('/profile')
  .put(updateCurrentUserProfile);

export default router;