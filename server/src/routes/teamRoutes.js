import express from 'express';
import { createTeam, getAllTeams } from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lock down endpoints using standard session validation mechanics
router.use(protect);

router.route('/')
  .post(createTeam)
  .get(getAllTeams);

export default router;