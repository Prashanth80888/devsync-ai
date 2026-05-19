import express from 'express';
import { createProject, getAllProjects } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Intercept all downstream nodes with token verification guards
router.use(protect);

router.route('/')
  .post(createProject)
  .get(getAllProjects);

export default router;