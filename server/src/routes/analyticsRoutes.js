import express from 'express';
import { getWorkspaceSummaryMetrics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Intercept all tracking routes with standard JWT validation guards
router.use(protect);

router.route('/summary')
  .get(getWorkspaceSummaryMetrics);

export default router;