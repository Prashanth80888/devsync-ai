import express from 'express';
import { createOrganization, getOrganizationBySlug } from '../controllers/orgController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce token authentication guards across all organization structural routing nodes
router.use(protect);

router.post('/', createOrganization);
router.get('/:slug', getOrganizationBySlug);

export default router;