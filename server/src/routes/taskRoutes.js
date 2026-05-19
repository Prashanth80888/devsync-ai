import express from 'express';
import { createTask, getProjectTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce standard authentication token validation across all task routing structures
router.use(protect);

router.route('/')
  .post(createTask);

router.route('/:id')
  .patch(updateTask)
  .delete(deleteTask);

router.route('/project/:projectId')
  .get(getProjectTasks);

export default router;