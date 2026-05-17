import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';

const router = Router();

/**
 * Health Check Boundary Endpoint
 * High-frequency entry checkpoint utilized by reverse proxies or monitoring scripts
 * to confirm execution status of the underlying cluster node.
 */
router.get('/health', asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}));

export default router;