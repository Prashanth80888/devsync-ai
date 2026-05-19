import express from 'express';
import { getWorkspaceActivity } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce token authentication across the entire activity routing matrix
router.use(protect);

router.route('/')
  .get(getWorkspaceActivity);

export default router;