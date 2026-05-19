import { PrismaClient } from '@prisma/client';
import { AppError, asyncHandler } from '../middleware/errorMiddleware.js';

const prisma = new PrismaClient();

/**
 * @desc    Fetch chronological system logs linked to the user's active tenant workspace
 * @route   GET /api/v1/activity
 * @access  Private
 */
export const getWorkspaceActivity = asyncHandler(async (req, res, next) => {
  const orgId = req.user.orgId;

  if (!orgId) {
    return next(new AppError('No active multi-tenant workspace context detected.', 400));
  }

  // Retrieve the latest 15 timeline events for the active organization
  const logs = await prisma.activityLog.findMany({
    where: { orgId },
    take: 15,
    include: {
      user: {
        select: { id: true, fullName: true, avatarUrl: true }
      },
      project: {
        select: { id: true, name: true }
      }
    },
    orderBy: {
      createdAt: 'desc' // Ensures the newest events appear at the top of the feed
    }
  });

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: { activities: logs }
  });
});